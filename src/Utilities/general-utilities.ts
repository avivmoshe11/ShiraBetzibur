class GeneralUtilities {
  public async sleep(ms: number): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  public getTimeStamp() {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    return new Date().toLocaleString(undefined, options).replace(/,/g, ' ').replace(/  /g, ' ');
  }
}

export default new GeneralUtilities();
