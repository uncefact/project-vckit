# Agent Explorer

## Installation

```bash
npm -g i agent-explore
```

## Usage

```bash
agent-explore serve --port 8080
```

You can specify a default agent configuration

```bash
agent-explore serve --port 8080 --schemaUrl https://example.ngrok.io/open-api.json --apiKey test123 --name Agent
```

## Basic architecture

Agent Explorer is provides a quick and easy UI framework to get started building and testing features in Veramo. If you have an idea to build something you can create a Widget for it and pin it to your dashboard for ease of access. As we use it internally for building new features, POCs and demos we designed it to be as flexible as possible with the most common use cases surfaced.

### Pages

Pages use templates, currently single and double column. These templates are responsive.

## Components

There are 2 types of components. **Standard components** that we all know and love. Functional, can fetch data if needed or not and we have **Widgets** which are React Lazy components. This components can be loaded at runtime and their configuration are saved locally to your browser. This is ideal for developing features in Veramo.

## Fast start with Docker

1. Install the Docker system on your computer. Go to https://www.docker.com/products/docker-desktop for installation on Windows and Mac. If you are using Ubuntu Linux, follow install instructions here: https://docs.docker.com/install/linux/docker-ce/ubuntu/.

2. Now you need to <i><b>git clone</b></i> this repository onto your computer. The repo link is:<pre>https://github.com/uncefact/project-vckit</pre>
3. Open a terminal prompt (Mac and Linux) or PowerShell (Windows 10) and change directory to the one at the 'root' of
   your local cloned copy of this repository, so you can see the file <b>docker-compose.yml</b> in the current folder.
4. Run the following command to start the Docker containers:<pre>docker-compose up -d</pre>
