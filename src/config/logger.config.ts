import { ConsoleLogger } from '@nestjs/common';

export class logger extends ConsoleLogger {
  log(message: any, context?: string) {
    if (context === 'RoutesExplorer' || context === 'RouterExplorer') {
      return;
    }
    super.log(message, context);
  }
}
