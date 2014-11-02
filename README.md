
Savedo Client README:
===

### Technology / Packages Used


**Angularjs** - After a few years of trying Backbone (and hating its approach to scoping), Ember, and just using jQuery, I’ve found that: its structure scales beautifully, its two-way bindings and tags are better than any approach to templating, and its modular MV* separation of concerns makes it easy to plugin any BDD tests. It’s designed from the start for large, reliable systems.

**Protactor** end-to-end test suite

**yeoman angular-generator boilerplate** https://github.com/yeoman/generator-angular chosen for its better integration with grunt, bower, and multiple testing approaches

**angular-local-storage** a way to abstract storage while using the same conventions of ng-resource, so it’s easy to convert this app to use REST instead.

**grunt / yeoman** - to automate processes and guard against both carpal tunnel syndrome and my own unreliable memory

**webshim**
	Angular's HTML5 form validation is great...until you have a browser that doesn't implement it.
	
----
### Building from repo

Tools needed:

**npm**

**bower**

**grunt**
 

    $ git clone <this repo>
    $ npm install
    $ bower install
    $ grunt server
    
 Server starts at http://localhost:9000
    