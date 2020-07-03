import inquirer, { QuestionCollection } from 'inquirer';

export default class Prompt {
  static create(prompts: QuestionCollection[]) {
    return new Prompt(prompts);
  }

  prompts: QuestionCollection[];

  constructor(prompts: QuestionCollection[] = []) {
    this.prompts = prompts;
  }

  async excute() {
    let results: { [k: string]: any } = {};

    for (const prompt of this.prompts) {
      const result = await inquirer.prompt(prompt);
      results = { ...results, ...result };
    }

    return results;
  }
}
