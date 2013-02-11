---
layout: post
title: Pull and Flow

excerpt: An observation on team structure and productivity
published: true
---

## An observation on team structure and productivity

When a manager publicly assigns a task to someone (eg in jira, or pivotal, or on a card wall),
they are publicly attaching that employee to an expectation that the task will be completed.

Humans are susceptible to a cognitive bias in this situation; they naturally want to please (and be seen to please) their manager.

The problem with this bias is that other important activities (eg bugfixes, toolchain improvements) are not prioritised fairly as a result.

The farther behind you get on a task, the more willing you become to do things like add poorly-factored code to the system, skip writing tests, or create bugs.

More mature/senior employees are less affected by this bias, because they understand what happens when you ignore the other stuff.

## An alternative
In the LPOS team at Lonely Planet, we adopted a different approach.
Managers maintained a single, prioritised queue of tasks - features, bugfixes, you name it.

Developers (collectively) became responsible for getting the highest-priority things completed as quickly as possible.

This avoides the bias described earlier: now, when a task drags out, the whole team hold collective responsibility (and everyone wants to know how they can help).

Developers no longer prioritise multiple incoming streams of work (eg features/bugs/support requests), but instead assist management in evaluating priorities for the queue.

Spending time on improving tools so the whole team benefits no longer requires putting aside 'your' work.

Did it make all our problems go away? Of course not. 
Would it work with 15-20 developers? Who knows.

We sure shipped a more good code, and our users were thrilled.
