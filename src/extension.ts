import * as vscode from 'vscode';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('vscode-extension-lighthouse.launchLighthouse', () => {
		// The code you place here will be executed every time your command is executed

		// Install Lighthouse globally
			try { 
				// runTerminalCommand('npm install -g lighthouse')
				// List of URLs to run Lighthouse on
				const urls = [
					'https://www.soeur.fr',
					// 'https://www.soeur.uk',
					// 'https://www.mellerio.fr'
				];

				// Run Lighthouse on each URL
				urls.forEach(url => {
					try {
						runTerminalCommand(`lighthouse ${url}`)
						.then(() => {
							// Process the generated HTML report
							const currentDate = new Date();

							const year = currentDate.getFullYear();
							const month = String(currentDate.getMonth() + 1).padStart(2, '0');
							const day = String(currentDate.getDate()).padStart(2, '0');
							const formattedDate = `${year}-${month}-${day}`;

							const hours = String(currentDate.getHours()).padStart(2, '0');
							const minutes = String(currentDate.getMinutes()).padStart(2, '0');
							const seconds = String(currentDate.getSeconds()).padStart(2, '0');
							const formattedTime = `${hours}-${minutes}-${seconds}`;

							const reportFilename = `${url}_${formattedDate}_${formattedTime}.report.html`;
							vscode.window.showInformationMessage(`Report generated: ${reportFilename}`);
							
							// needed right after
							function openReport() {
								try {
									//vscode.window.showInformationMessage(`Read ${reportFilename}: ${data}`);
									runTerminalCommand(`open ${reportFilename}`);
								}
								catch (error) {
										vscode.window.showErrorMessage(`Failed to read ${reportFilename}: ${error}`);	
								}
							}

							try {
								setTimeout(openReport, 20000)
							} 
							catch (error) {
								vscode.window.showErrorMessage(`Failed to open ${reportFilename}: ${error}`);
							};
						})
					} 
					catch (error) {
						vscode.window.showErrorMessage(`Failed to run Lighthouse on ${url}: ${error}`);
					};
				});
			}
			catch (error) {
				vscode.window.showErrorMessage(`Failed to install Lighthouse: ${error}`);
			}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

// Helper function to run a command in the terminal
function runTerminalCommand(command: string): Thenable<void> {
	return new Promise<void>((resolve, reject) => {
		const terminal = vscode.window.createTerminal();
		terminal.sendText(command);
		vscode.window.onDidCloseTerminal(closedTerminal => {
			if (closedTerminal === terminal) {
				resolve();
			}
		});
	});
}


