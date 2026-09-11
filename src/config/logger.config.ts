import { ConsoleLogger } from '@nestjs/common';

export class logger extends ConsoleLogger {
  log(message: any, context?: string) {
    if (context === 'RoutesExplorer' || context === 'RouterExplorer' || context === 'RoutesResolver') {
      return;
    }
    super.log(message, context);
  }
}
