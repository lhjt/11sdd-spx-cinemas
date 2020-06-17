import chalk from "chalk";

export class Logger {
    public static info(message: string): void {
        console.log(chalk.blue(`[ ℹ ] ${message}`));
    }

    public static warn(message: string): void {
        console.log(chalk.yellow(`[ ⚠ ] ${message}`));
    }

    public static success(message: string): void {
        console.log(chalk.green(`[ ✔ ] ${message}`));
    }
}
