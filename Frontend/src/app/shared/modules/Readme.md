In this folder 
`/app/shared/services` are all global services.

These get registered over the shared.module.ts`s toRoot method in app.module.ts,
 so that they are globally available (also in lazy loaded modules)

* https://angular.io/docs/ts/latest/cookbook/ngmodule-faq.html#!#q-why-bad
* https://angular.io/docs/ts/latest/cookbook/ngmodule-faq.html#!#q-for-root
