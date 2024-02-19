import moment from 'moment';
import { CronJob } from 'cron';
import consoleUtilities from './console-utilities.js';
import { JobDefinition } from '../Types/job-types.js';

class JobUtilities {
  private jobDefinitions: JobDefinition[] = [];

  public registerJob(name: string, action: () => Promise<any> | any, timeExpression: string) {
    this.jobDefinitions.push({ name, action, timeExpression, isRunning: false, job: null });
  }

  public startJobs() {
    for (const jobDef of this.jobDefinitions) {
      jobDef.job = new CronJob(jobDef.timeExpression, async () => await this.runJob(jobDef), null, true);

      this.cronLog(`Started job with time expression '${jobDef.timeExpression}'`, jobDef);
    }
  }

  private async runJob(jobDef: JobDefinition) {
    let startTime;
    let isAlreadyRunning = false;

    try {
      this.cronLog(`Executing job`, jobDef);
      startTime = moment();

      if (jobDef.isRunning) {
        isAlreadyRunning = true;
        throw new Error(`Job '${jobDef.name}' is already running. It may be stuck`);
      }

      jobDef.isRunning = true;
      await jobDef.action();

      this.cronLog(`Executed job ${this.runningTimeText(startTime)}`, jobDef);
    } catch (err) {
      this.cronError(`Error occurred when executing job: ${err} ${this.runningTimeText(startTime) || ''}`, jobDef);
    }

    if (!isAlreadyRunning) {
      jobDef.isRunning = false;
    }
  }

  private cronLog(msg: string, jobDef: JobDefinition) {
    consoleUtilities.log(msg, 'CRON', jobDef.name);
  }

  private cronError(msg: string, jobDef: JobDefinition) {
    consoleUtilities.error(msg, 'CRON', jobDef.name);
  }

  private runningTimeText(startTime: any) {
    if (startTime) {
      const elapsedDuration = moment.duration(moment().diff(startTime));

      return `(Action duration: ${elapsedDuration.asSeconds()} seconds)`;
    }
  }
}

export default new JobUtilities();
