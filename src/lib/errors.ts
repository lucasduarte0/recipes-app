export class MaxSizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MaxSizeError';
  }
}
