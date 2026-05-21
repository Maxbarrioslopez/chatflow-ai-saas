import { prisma } from '../prisma';
import { AppError } from '../../common/errors';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'ai' | 'delay' | 'webhook' | 'email' | 'handoff';
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export class WorkflowService {
  async evaluateWorkflow(chatbotId: string, event: string, context: Record<string, any>) {
    const workflows = await prisma.workflow.findMany({
      where: { chatbotId, isActive: true },
    });

    for (const workflow of workflows) {
      const definition = workflow.definition as unknown as WorkflowDefinition;
      const triggerNodes = definition.nodes.filter((n) => n.type === 'trigger' && n.config.event === event);

      for (const trigger of triggerNodes) {
        await this.executeNode(workflow.id, trigger, definition, context);
      }
    }
  }

  private async executeNode(
    workflowId: string,
    node: WorkflowNode,
    definition: WorkflowDefinition,
    context: Record<string, any>,
  ) {
    switch (node.type) {
      case 'condition':
        await this.evaluateCondition(workflowId, node, definition, context);
        break;
      case 'action':
        await this.executeAction(node, context);
        break;
      case 'ai':
        await this.executeAINode(node, context);
        break;
      case 'handoff':
        await this.executeHandoff(node, context);
        break;
      case 'webhook':
        await this.executeWebhook(node, context);
        break;
    }
  }

  private async evaluateCondition(
    workflowId: string,
    node: WorkflowNode,
    definition: WorkflowDefinition,
    context: Record<string, any>,
  ) {
    const { field, operator, value } = node.config;
    const actualValue = this.getNestedValue(context, field);

    let matched = false;
    switch (operator) {
      case 'equals':
        matched = actualValue === value;
        break;
      case 'contains':
        matched = String(actualValue).includes(value);
        break;
      case 'gt':
        matched = Number(actualValue) > Number(value);
        break;
      case 'lt':
        matched = Number(actualValue) < Number(value);
        break;
      case 'regex':
        matched = new RegExp(value).test(String(actualValue));
        break;
    }

    const nextEdge = definition.edges.find(
      (e) => e.source === node.id && e.condition === (matched ? 'true' : 'false'),
    );

    if (nextEdge) {
      const nextNode = definition.nodes.find((n) => n.id === nextEdge.target);
      if (nextNode) {
        await this.executeNode(workflowId, nextNode, definition, context);
      }
    }
  }

  private async executeAction(node: WorkflowNode, context: Record<string, any>) {
    const { action, params } = node.config;
    switch (action) {
      case 'tag_lead':
        await this.tagLead(context.leadId, params.tags);
        break;
      case 'update_status':
        await this.updateLeadStatus(context.leadId, params.status);
        break;
      case 'send_email':
        await this.sendNotification(params.email, params.subject, params.body, context);
        break;
    }
  }

  private async executeAINode(node: WorkflowNode, context: Record<string, any>) {
    const { prompt, model } = node.config;
    const filledPrompt = this.fillTemplate(prompt, context);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: filledPrompt }],
        }),
      });

      const data = await response.json() as any;
      context.aiResult = data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('AI node error:', error);
    }
  }

  private async executeHandoff(node: WorkflowNode, context: Record<string, any>) {
    const { channel, destination } = node.config;
    const message = this.fillTemplate(node.config.message || 'Conversation handed off', context);

    await prisma.handoff.create({
      data: {
        conversationId: context.conversationId,
        channel,
        destination,
        message,
        status: 'pending',
      },
    });
  }

  private async executeWebhook(node: WorkflowNode, context: Record<string, any>) {
    const { url, method = 'POST' } = node.config;
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'workflow_action', context }),
      });
    } catch (error) {
      console.error('Webhook error:', error);
    }
  }

  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private fillTemplate(template: string, context: Record<string, any>): string {
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, key) => {
      return String(this.getNestedValue(context, key) ?? '');
    });
  }

  private async tagLead(leadId: string, tags: string[]) {
    if (!leadId) return;
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return;
    const currentTags = (lead.tags as string[]) || [];
    await prisma.lead.update({
      where: { id: leadId },
      data: { tags: [...new Set([...currentTags, ...tags])] },
    });
  }

  private async updateLeadStatus(leadId: string, status: string) {
    if (!leadId) return;
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: status as any },
    });
  }

  private async sendNotification(email: string, subject: string, body: string, context: Record<string, any>) {
    const filledBody = this.fillTemplate(body, context);
    console.log(`[NOTIFICATION] To: ${email}, Subject: ${subject}, Body: ${filledBody}`);
    // Integrate with Resend/SendGrid here
  }
}

export const workflowService = new WorkflowService();
