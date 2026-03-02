export interface VeilleSource {
  name: string;
  icon: string;
  iconColor: string;
  description: string;
}

export interface VeilleMethodology {
  subject: string;
  description: string;
  frequency: string;
  tools: string;
}

export interface VeilleSynthese {
  id: string;
  title: string;
  date: string;
  source: string;
  summary: string;
  analysis: string[];
  link: string;
}

export const VEILLE_METHODOLOGY: VeilleMethodology = {
  subject: 'Artificial Intelligence & Machine Learning',
  description: 'Tracking advances in AI/ML: new models, frameworks, industrial applications and regulatory landscape.',
  frequency: 'Daily to weekly',
  tools: 'Newsletters, YouTube, Reddit, GitHub',
};

export const VEILLE_SOURCES: VeilleSource[] = [
  {
    name: 'YouTube',
    icon: 'fa-brands fa-youtube',
    iconColor: '#FF0000',
    description: 'Fireship, Two Minute Papers, Yannic Kilcher',
  },
  {
    name: 'Reddit',
    icon: 'fa-brands fa-reddit-alien',
    iconColor: '#FF4500',
    description: 'r/MachineLearning, r/artificial, r/LocalLLaMA',
  },
  {
    name: 'GitHub',
    icon: 'fa-brands fa-github',
    iconColor: '#6E40C9',
    description: 'Trending repos, Hugging Face, Papers with Code',
  },
  {
    name: 'Twitter / X',
    icon: 'fa-brands fa-x-twitter',
    iconColor: '#1DA1F2',
    description: '@AndrewYNg, @ylecun, @OpenAI, @AnthropicAI',
  },
  {
    name: 'TLDR AI',
    icon: 'fa-solid fa-envelope',
    iconColor: '#10B981',
    description: 'Daily AI digest delivered by email',
  },
  {
    name: 'TLDR Dev',
    icon: 'fa-solid fa-code',
    iconColor: '#3B82F6',
    description: 'Daily dev & tech news roundup',
  },
];

export const VEILLE_SYNTHESES: VeilleSynthese[] = [
  {
    id: 'open-source-models',
    title: 'The Rise of Open-Source Models',
    date: 'Oct 2025',
    source: 'GitHub / Hugging Face',
    summary: 'LLaMA, Mistral, Gemma: how open-source is reshaping the AI landscape.',
    analysis: [
      'In 2025, open-source language models reached performance levels that rival proprietary solutions. Meta with LLaMA 3, Mistral AI with its Mixtral models, and Google with Gemma have significantly closed the quality gap with GPT-4 and Claude.',
      'The Hugging Face ecosystem plays a central role in this democratization. With over 500,000 hosted models, the platform enables developers to fine-tune and deploy models tailored to their specific needs without relying on expensive proprietary APIs.',
      'This trend has a direct impact on software development: companies can now integrate AI capabilities into their products while retaining control over their data and reducing infrastructure costs. The open-source AI movement also fosters transparency and research reproducibility.',
      'However, challenges remain: open-source models still require significant resources for training and deployment, and the question of liability in cases of misuse remains open.',
    ],
    link: 'https://huggingface.co/blog',
  },
  {
    id: 'ai-agents',
    title: 'Autonomous AI Agents',
    date: 'Nov 2025',
    source: 'TLDR AI / Twitter',
    summary: 'Claude Code, Copilot, Devin: the emergence of agents that can code autonomously.',
    analysis: [
      'Autonomous AI agents represent a major evolution from simple chat assistants. Unlike a classic LLM that answers a question, an agent can plan, execute actions, use tools, and iterate on its results to accomplish complex tasks.',
      "Anthropic's Claude Code illustrates this trend well: it can navigate a codebase, modify files, run tests, and fix bugs autonomously. GitHub Copilot is evolving in the same direction with its agent mode, while Cognition AI's Devin positions itself as a complete 'AI software engineer'.",
      "The ReAct (Reasoning + Acting) pattern is at the heart of these systems: the agent reasons about the task, chooses an action, observes the result, then adjusts its strategy. This loop enables solving problems that previously required constant human intervention.",
      'For developers, this fundamentally changes the workflow: the focus shifts from writing code to specification, review, and validation. The ability to formulate clear instructions and evaluate generated code becomes a key skill.',
    ],
    link: 'https://www.anthropic.com/claude-code',
  },
  {
    id: 'predictive-maintenance',
    title: 'AI in Industry: Predictive Maintenance',
    date: 'Dec 2025',
    source: 'Reddit / YouTube',
    summary: 'IoT + ML to anticipate industrial failures — directly tied to my experience at Clauger.',
    analysis: [
      'Predictive maintenance combines IoT sensors and machine learning algorithms to anticipate industrial equipment failures before they occur. In the industrial refrigeration sector, where I work at Clauger, this approach is particularly relevant.',
      'Compressors, heat exchangers, and refrigeration systems continuously generate temperature, pressure, and vibration data. ML models (Random Forest, LSTM, autoencoders) analyze these streams to detect abnormal patterns and predict failures days in advance.',
      'The economic impact is considerable: reducing unplanned downtime by 30 to 50%, extending equipment lifespan, and optimizing maintenance interventions. For a company like Clauger, operating in over 20 countries, the scalability of these solutions is a major challenge.',
      'My full-stack development experience (FretClauger) gives me a concrete perspective on integrating these technologies: monitoring dashboards, data collection APIs, and visualization interfaces are all essential software building blocks for these systems.',
    ],
    link: 'https://www.ibm.com/topics/predictive-maintenance',
  },
  {
    id: 'ai-act',
    title: 'AI Regulation in Europe: The AI Act',
    date: 'Jan 2026',
    source: 'TLDR Dev / Twitter',
    summary: "The European legal framework for AI takes effect — implications for developers.",
    analysis: [
      "The European AI Act, progressively coming into force since 2024, establishes the world's first comprehensive legal framework for artificial intelligence. Based on a risk-level approach, it classifies AI systems into four categories: unacceptable risk (banned), high risk, limited risk, and minimal risk.",
      'For developers, the implications are concrete: high-risk AI systems (healthcare, education, recruitment, critical infrastructure) must meet strict requirements for transparency, technical documentation, training data quality, and human oversight.',
      'Foundation models (GPT, Claude, LLaMA) are subject to specific transparency obligations: documentation of capabilities and limitations, copyright compliance in training data, and labeling of AI-generated content.',
      'As a full-stack developer, I need to integrate these constraints from the design phase: logging algorithmic decisions, building explainability mechanisms, and creating interfaces that enable human oversight. This is a paradigm shift that brings AI development closer to the compliance standards already known in the financial and medical sectors.',
    ],
    link: 'https://artificialintelligenceact.eu/',
  },
];

export const createVeille = (): string[] => {
  const veille: string[] = [];
  veille.push('<br>');
  veille.push("<span class='command'>Opening tech watch...</span>");
  veille.push('<br>');
  return veille;
};

export const VEILLE = createVeille();
