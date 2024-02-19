export type JobDefinition = {
  name: string;
  action: () => Promise<any> | any;
  timeExpression: string;
  isRunning: boolean;
  job: any;
};
