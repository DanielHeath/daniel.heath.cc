---
layout: post
title: Push vs Pull

excerpt: An observation on team structure and productivity
published: true
---

## Team structure and productivity

When a manager publicly assigns a task to someone (eg in jira, or pivotal, or on a card wall),
they are publicly attaching that employee to an expectation that the task will be completed.

Humans are susceptible to a cognitive bias in this situation; they naturally want to please (and be seen to please) their manager.
The problem with this bias is that other important activities (eg maintaining a holistic view of the system, bugfixes, toolchain improvements, assisting others) are not prioritised fairly.

As a result, employees micro-optimize for their current task (eg by not helping others, creating/ignoring bugs, not testing their work carefully). This is particularly the case when the current task is behind its expected completion date.

## An alternative
In the LPOS team at Lonely Planet, we adopted a different approach.

The entire team were involved in prioritisation meetings weekly (lead by management), to produce a single, prioritised queue of tasks - features, bugfixes, you name it. 
They were totally optional (about half the development team came to any given meeting).

Developers (collectively) became responsible for getting the highest-priority things completed as quickly as possible.

This avoids the bias described earlier: now, when a task drags out, the whole team hold collective responsibility (and everyone wants to know how they can help).

Developers no longer prioritise multiple incoming streams of work (eg features/bugs/support requests), but instead assist management in evaluating priorities for the queue.

Spending time on improving tools so the whole team benefits no longer requires putting aside 'your' work.

Did it make all our problems go away? Of course not. 

Would it work with 15-20 developers? I would love to find out.

We shipped more software after the change, and our users were thrilled.

## Followup

I'd like to thank [Brent Snook](http://twitter.com/brentsnook) for some really insightful observations which I've incorporated into this original article.

Paraphrasing from his response:

<div class="well">
  <p>
    There is a definite difference when everyone feels like they own prioritisation and agree on the importance of what they are doing next.
  </p>
  <p>
    When you go through the process of evaluating pieces of work against others, your goal becomes to solve that important problem in the context of delivering a product.
  </p>
  <p>
    We gained a more holistic view of the problem we were solving, which helped us avoid micro-optimization.
  </p>
</div>