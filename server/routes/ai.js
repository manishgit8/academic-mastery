import express from 'express';
import { createXaiChatCompletion } from '../services/xaiChat.js';

const router = express.Router();

function buildSystemPrompt({ student, tasksSummary }) {
  const parts = [
    'You are an AI learning assistant inside a Student Portal.',
    'Help the student understand concepts, plan study time, and break down tasks.',
    'Prefer short, clear explanations with steps and examples.',
    'Do not help with cheating: don’t provide direct answers meant to be submitted as-is; instead guide the student to learn and solve it.',
  ];

  if (student?.name) parts.push(`Student name: ${student.name}.`);
  if (student?.grade) parts.push(`Student grade/id: ${student.grade}.`);
  if (tasksSummary) parts.push(`Upcoming tasks:\n${tasksSummary}`);

  return parts.join('\n');
}

router.post('/ai/student-assist', async (req, res) => {
  try {
    const { message, history, student, tasks } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const safeHistory = Array.isArray(history) ? history : [];
    const tasksSummary = Array.isArray(tasks)
      ? tasks
          .slice(0, 10)
          .map((t) => {
            const title = typeof t?.title === 'string' ? t.title : 'Untitled';
            const due = t?.dueDate ? ` (due ${t.dueDate})` : '';
            const priority = t?.priority ? ` [${t.priority}]` : '';
            return `- ${title}${priority}${due}`;
          })
          .join('\n')
      : '';

    const messages = [
      { role: 'system', content: buildSystemPrompt({ student, tasksSummary }) },
      ...safeHistory
        .filter((m) => m && typeof m.content === 'string')
        .slice(-20)
        .map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      { role: 'user', content: message.trim() },
    ];

    const { content } = await createXaiChatCompletion({
      messages,
      maxTokens: 600,
    });

    res.json({ reply: content });
  } catch (err) {
    const status = err?.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
    res.status(status).json({ error: err?.message || 'AI request failed' });
  }
});

export default router;

