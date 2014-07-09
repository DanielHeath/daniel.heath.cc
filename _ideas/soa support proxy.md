# Front-end proxy app

I want to be able to compose many services into a website,
so that small teams can manage their own stack without
having to use standardized tools etc.

This is a pattern which many large engineering groups
have adopted successfully (e.g. amazon, twitter, linkedin).

The reason this works well (for applications where both domain
logic and presentation is critical) is that it allows teams to focus
on doing one thing really well.

Amongst (many) other important features, templating needs to
work the same way both server and client side, so that updates
can be applied either via JS or through a page reload.
This does not mandate JS on the server, but it would
be one of the easier ways to do it.

Some other features which are going to matter:
 * Websockets / push
 * graceful degradation when upstream services are unavailable
 * Speed; this can't afford to add more than a couple of ms under high load
 * internationalization
 * request / performance tracing (e.g. zipkin)
 * being able to develop against a contract without running every single backing service

Likely approaches:
Scala+rhino(templating)+hystrix+zipkin+
Node+templating+write a socket library
