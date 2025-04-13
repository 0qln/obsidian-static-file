import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface PluginSettings {
	path: string;
	content: string;
}

const DEFAULT_SETTINGS: PluginSettings = {
	path: '',
	content: ''
}

export default class StaticFilePlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
		
		this.addCommand({
			id: 'generate-static-file',
			name: 'Generate Static File',
			callback: async () => {
				const file = await this.app.vault.create(this.settings.path, this.settings.content);
			}
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: StaticFilePlugin;

	constructor(app: App, plugin: StaticFilePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Path')
			.setDesc('File path of the file to be created.')
			.addText(text => text
				.setPlaceholder('Enter the path')
				.setValue(this.plugin.settings.path)
				.onChange(async (value) => {
					this.plugin.settings.path = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('Content')
			.setDesc('Content of the file to be created.')
			.addTextArea(text => text
				.setPlaceholder('Enter the content')
				.setValue(this.plugin.settings.content)
				.onChange(async (value) => {
					this.plugin.settings.content = value;
					await this.plugin.saveSettings();
				}));
	}
}
