---
date: 2023-02-06
title: "Typescript Decorators: What you need to know"
template: post
thumbnail: "../thumbnails/typescript.png"
slug: typescript-decorators-what-do-you-need-to-know
seoImage: "../thumbnails/typescript.png"

categories:
  - Typescript
  - Javascript
tags:
  - Typescript
  - Javascript
---

## Introduction

Typescript Decorators are a feature of the Typescript programming language that adds additional behavior to an existing code. In simple words, a decorator is just a wrapper that adds some extra functionality to a class, method, property or parameter. Typescript Decorators were introduced in version 2.0 of the language, which was released in 2016.

## Usage

A decorator is applied to a declaration using the @ symbol. For example, to apply a decorator to a class, you would write @myDecorator before the class definition, like this:

```typescript
@myDecorator
class MyClass {
  // class body
}
```

Similarly, to apply a decorator to a method, you would write @myDecorator before the method definition:

```typescript
class MyClass {
  @myDecorator
  myMethod() {
    // method body
  }
}
```

## Examples

Let's look at a few examples of decorators in Typescript.

**Class Decorator**

A class decorator is applied to a class and can modify the constructor of the class. Here is an example:

```typescript
function logClass(target: any) {
  console.log(target)
}

@logClass
class MyClass {
  constructor() {
    console.log("Instantiating MyClass")
  }
}

const myInstance = new MyClass()
// Output:
// [Function: MyClass]
// Instantiating MyClass
```

**Property Decorator** A property decorator is applied to a property and can modify the behavior of the property. Here is an example:

```typescript
function logProperty(target: any, propertyKey: string) {
  console.log(propertyKey + " has been accessed!")
}

class MyClass {
  @logProperty
  myProperty: string = "Hello World!"
}

const myInstance = new MyClass()
console.log(myInstance.myProperty)
// Output:
// myProperty has been accessed!
// Hello World!
```

---

**Method Decorator** A method decorator is applied to a method and can modify the behavior of the method. Here is an example:

```typescript
function logMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log(propertyKey + " has been called!")
}

class MyClass {
  @logMethod
  myMethod() {
    console.log("Calling myMethod")
  }
}

const myInstance = new MyClass()
myInstance.myMethod()
// Output:
// myMethod has been called!
// Calling myMethod
```

**Parameter Decorator** A parameter decorator is applied to a parameter of a method and can modify the behavior of the parameter. Here is an example:

```typescript
function logParameter(target: any, propertyKey: string, parameterIndex: number) {
  console.log(propertyKey + " has been called with parameter " + parameterIndex);
}

class MyClass {
  myMethod(@logParameter myParameter: any) {
    console.log("Calling myMethod with " + myParameter);
```

## Summary

Typescript decorators are a design pattern in Typescript that allows developers to add new behavior to an existing code. Decorators were introduced in Typescript version 1.5 and have since become a powerful tool for creating custom, reusable code. Decorators are used to modify the behavior of classes, properties, methods, and parameters and can be applied using the @ symbol followed by the name of the decorator. They are a useful tool for creating more flexible and maintainable code by allowing developers to separate the implementation of logic from the declaration of its behavior. Examples of decorators include @Component for creating a React component and @Injectable for creating a service in Angular. In conclusion, decorators in Typescript are a valuable tool for enhancing the functionality of existing code.
