const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

//Menu is used to customize the top menu bar of the application

let mainWindow, addWindow;

app.on('ready', () => {
	//console.log('running');
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(`file://${__dirname}/main.html`);
	mainWindow.on('closed', () => app.quit());

	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);

	//Menu.buildFromTemplate is a function that take menu template as an argument and builds the top menu for us
	//Menu.setApplicationMenu set the menu bar after it is build

});

function createAddWindow() {
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add New TODO'
	});

	//BrowerWindow take a Object as an argument in which we can specify the window properties
	addWindow.loadURL(`file://${__dirname}/add.html`);
	addWindow.on('closed', () => addWindow = null); 
	//garbage collection of Javascript when closed we set the variable to null to free the space

}

function clearList() {
	mainWindow.webContents.send('todo:clear');
}

//function to clear the whole todo list 

ipcMain.on('todo:add', (event,todo) => {
	//console.log(todo);
	mainWindow.webContents.send('todo:add', todo);
	addWindow.close();

	//addWindow.close closes the window after it's work is done
});

const menuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New Todo',
				accelerator: 'Shift+N',
				click(){
					createAddWindow();
				}
			},
			{
				label: 'Clear List',
				accelerator: 'Shift+C',
				click(){
					clearList();
				}
			},
			{
				label: 'Quit',
				accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click() {
					app.quit();
				}
			}

		]
	}
];

//This is how we define a Menu Template which is an array of objects

//label is a key used to name the Option that user will get to click

//submenu use to make sub options it is also an array of objects

//accelerator is a key used to give short cuts to the options in the menu

//click() is a function which is called when the perticular option is clickes

if(process.platform === 'darwin') {
	menuTemplate.unshift({});
}

//above if statement of for makeing it OS independent

//Array.unshift() adds a new element at the begining of an array

//process.platform is inbuilt with node which return the platfrom eg for OSX = darwin


if(process.env.NODE_ENV !== 'production') {
	menuTemplate.push({
		label: 'View',
		submenu: [
			{
				label: 'Toggle Developer Tools',
				accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload',
			}
		]
	})
}

//process.env.NODE_ENV is a node defined variable which have following values
// 'production'
// 'development'
// 'staging'
// 'test'

//above if statement is for the productions as so we can get a option in an menu when it is in productions 
//role is predefined key in Electron which makes our task easy to make some options

