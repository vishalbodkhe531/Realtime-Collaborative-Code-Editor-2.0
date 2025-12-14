# Live Code Editor

A collaborative, real-time, multi-language online code editor built with modern web technologies. This project enables users to write, edit, share, and execute code directly in the browser with live synchronization across clients.

---

## Features

* Real-time collaborative code editing powered by Liveblocks and Y.js
* Multi-language support using CodeMirror (JavaScript, Python, C++, Java, etc.)
* Clean and modern UI using Tailwind CSS + ShadCN
* Form validation with Zod
* Code execution via RapidAPI services
* Cloud database integration with MongoDB Atlas
* Fully deployed using Vercel
* Robust DevOps workflow using Git and GitHub

---

## Tech Stack

### **Frontend**

* Next.js
* React 
* TypeScript
* Tailwind CSS
* ShadCN UI
* Lucide React icons

### **Editor**

* CodeMirror 6
* Y.js + y-codemirror.next
* Multilanguage extensions (JS, Python, C++, Java)

### **Backend / Realtime**

* Liveblocks (React, Node, Y.js integration)
* MongoDB Atlas (with Mongoose ORM)

### **Validation & Forms**

* React Hook Form
* Zod
* @hookform/resolvers

### **APIs**

* RapidAPI (for code execution output generation)

### **DevOps & Deployment**

* Git & GitHub
* Vercel Deployment

---

## Dependencies Overview

This project uses a rich eco-system of libraries, including:

* CodeMirror and language packages
* Liveblocks for collaboration
* React Toastify for notifications
* Prettier and TypeScript for development
* TailwindCSS (v4) + PostCSS

---

## Scripts

* `dev` – Runs the development server using Turbopack
* `build` – Creates an optimized production build
* `start` – Runs the production server

---

## Project Purpose

The goal of this project is to provide a fully interactive, real-time coding environment suitable for:

* Pair programming
* Coding tutorials
* Code sharing
* Collaborative problem solving
* Online learning platforms

It integrates real-time sync, cloud storage, and multi-language execution to simulate a lightweight cloud IDE experience.

---

## Deployment

The application is deployed on **Vercel**, ensuring fast performance, serverless execution, and smooth CI/CD workflows via GitHub integration.

---

## About the Project

This live code editor demonstrates how modern web technologies can be combined to create powerful interactive tools. The integration of collaboration, serverless backend, cloud persistence, and API-driven execution makes it a highly extensible foundation for developer tools or educational platforms.

---
