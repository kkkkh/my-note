---
outline: deep
title: 《深入浅出Node.js》
lastUpdated: true
---
# 《深入浅出Node.js》
[代码地址](https://github.com/JacksonTian/diveintonode_examples)


<script setup>
import { data as posts } from './index.data.ts'
import { withBase } from 'vitepress'
// console.log(posts)
/*
<!--@include: @/back-end/Lang/NodeJs/Book/note/1-intro/1.md-->
<!--@include: @/back-end/Lang/NodeJs/Book/note/2-module/2.md-->
<!--@include: @/back-end/Lang/NodeJs/Book/note/3-IO/3.md-->
<!--@include: @/back-end/Lang/NodeJs/Book/note/4-programme/4.md-->
<!--@include: @/back-end/Lang/NodeJs/Book/note/5-memory/5.md-->
<!--@include: @/back-end/Lang/NodeJs/Book/note/6-buffer/6.md-->
<!--@include: @/back-end/Lang/NodeJs/Book/note/7-net/7.md-->
<!--@include: @/back-end/Lang/NodeJs/Book/note/8-app/8.md-->
<!--@include: @/back-end/Lang/NodeJs/Book/note/9-process/9.md-->
<!--@include: @/back-end/Lang/NodeJs/Book/note/10-test/10.md-->
<!--@include: @/back-end/Lang/NodeJs/Book/note/11-product/11.md-->
<!--@include: @/back-end/Lang/NodeJs/Book/note/12-appendix/12.md-->
*/
</script>

<ul>
  <li v-for="post of posts">
    <a :href="withBase(post.url)">{{ post.title }}</a>
  </li>
</ul>
