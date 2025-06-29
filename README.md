DebtBuster is a web app that helps users track their debts and payments, generate personalized AI repayment plans using OpenAI's API, and get instant answers through an integrated AI chatbot. The chatbot is designed to help users understand and clarify any doubts regarding their AI-generated financial plans.

## Features

- Add and track multiple debts
- Visual summary of outstanding balances
- AI-powered payment plan generator using OpenAI
- 💬 Built-in AI chatbot to answer questions about your plan
- Responsive and user-friendly interface


## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dharmik05/debtbuster.git
   cd debtbuster
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root of your project and add your OpenAI API key:

   ```env
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

## File Structure

```
debtbuster/
├── .env
├── public/
├── src/
│   └── (your source code)
├── package.json
├── README.md
```

## Powered by

- [OpenAI](https://platform.openai.com/)
- [Next.js](https://nextjs.org/)
