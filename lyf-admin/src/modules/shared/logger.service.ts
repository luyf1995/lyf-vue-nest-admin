import { Injectable } from '@nestjs/common';
import { transports, format } from 'winston';
import { WinstonModuleOptions, WinstonModule } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
  private readonly logger;

  constructor() {
    const options: WinstonModuleOptions = {
      level: 'info', // 设置日志级别
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }), // 添加时间戳
        format.json() // 使用 JSON 格式记录日志
      ),
      transports: [
        new transports.Console(), // 将日志输出到控制台
        new DailyRotateFile({
          dirname: 'logs', // 存储日志的目录
          filename: '%DATE%.log', // 日志文件名格式
          datePattern: 'YYYY-MM-DD', // 日期格式
          zippedArchive: true, // 将旧的日志压缩成归档文件
          maxSize: '20m', // 每个日志文件的最大大小
          maxFiles: '14d' // 最多保留几天的日志文件
        })
      ]
    };

    this.logger = WinstonModule.createLogger(options);
  }

  log(message: string) {
    this.logger.log(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
