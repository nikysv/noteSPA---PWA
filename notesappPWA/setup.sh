#!/bin/bash

echo "🔧 Setting up the Full Stack Notes App..."

cd backend_noteSPA
npm install
cd ..

cd frontend
npm install
cd ..


echo "   - Backend: cd backend_noteSPA && npm run start:dev"
echo "   - Frontend: cd frontend && npm run dev"
