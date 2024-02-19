import chalk from "chalk";
import generalUtilities from "./general-utilities.js";

class ConsoleUtilities {
  public log(msg: string, topic = "", subTopic = "") {
    console.log(chalk.blueBright(this.getPrefix(topic, subTopic) + msg));
  }

  public success(msg: string, topic = "", subTopic = "") {
    console.log(chalk.greenBright(this.getPrefix(topic, subTopic) + msg));
  }

  public error(msg: string, topic = "", subTopic = "") {
    console.error(chalk.red(this.getPrefix(topic, subTopic) + msg));
  }

  public boldLog(msg: string, topic = "", subTopic = "") {
    console.log(chalk.bgMagentaBright(chalk.bold(chalk.green(this.getPrefix(topic, subTopic) + msg + " "))));
  }

  private getPrefix(topic: string, subTopic: string) {
    if (topic) {
      topic = `{${topic}}`;
    }

    return `${generalUtilities.getTimeStamp()} | ${topic ? `${topic} ` : ""}${subTopic ? `(${subTopic}) ` : ""}`;
  }
}

export default new ConsoleUtilities();
