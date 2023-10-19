### A starter AI quiz app using NextJS and Anthropic Claude

## Resources

- [NextJS](https://nextjs.org)
- [Anthropic Claude](https://www.anthropic.com/) 
- [Lucia Auth](https://lucia-auth.com/) - GitHub login
- [AWS copliot](https://aws.github.io/copilot-cli/) - AppRunner, storage(Aurora Serverless v2 cluster), API and DB keys in SSM parameters & secrets manager , VPC

## Branches

- main - Auth uses better-sqlite3 adapter to maintain session information, calls Anthropic AI claude v1 using API key
- rds-branch - Auth uses Aurora Serverless v2 cluster to maintain session information, calls Anthropic AI claude v1 using API key
- bedrock-branch - Auth uses Aurora Serverless v2 cluster to maintain session information, calls Anthropic AI claude v2 using AWS bedrock

## Architecture

![Architecture](/quizai.jpg)


## Getting Started

### Pre-requisite

- [AWS copliot CLI](https://aws.github.io/copilot-cli/)
- [npm](https://www.npmjs.com/)

### Local development

First, clone the repository and run:

```bash
npm install
```

Setup a `.env` file using the sample file at the root of the repository.

then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deploy the App

Run, `copilot init` and run through the flow.(selecting `yes` at the end of the flow will deploy the app as well)

we can run `copilot deploy` to deloy the app.
