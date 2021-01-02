# WiLL
 Bringing Democracy to Discord

***let thy people's will be done***  
 \- some guy probably

[Invite Link](https://discord.com/oauth2/authorize?client_id=794073147288190981&permissions=8&scope=bot)

## Use
The WiLL role must have Adminstrator and be above all other roles to function correctly 

## Commands
**Note:** parameters in <> are mandatory and parameters in [] are optional

### ;ping
Ping the bot to check if the bot is still alive

### ;help
List all the available commands or get help for a particular command  
**Usage:** `;help [command]`  
**Example:**  `;help propose role`  

### ;setup
**(Admin Only)** Setup/change bot settings

#### ;setup proposals
Change the channel where proposals are sent in  
**Usage:** `;setup proposals <channel>`  
**Example:**  `;setup proposals #proposals`  

#### ;setup rules
Change the channel where the rules are posted  
**Usage:** `;setup rules <channel>`  
**Example:**  `;setup rules #rules`  

### ;propose
Propose a change to the server  

#### ;propose kick
Kick a user from the server  
**Usage:** `;propose kick <user> [reason]`  
**Example:**  `;propose kick @John Spamming in #general`  

#### ;propose ban
Ban a user from the server  
The maximum number of days messages can be deleted from is 7  
**Usage:** `;propose ban <user> [delete message days] [reason]`  
**Example:**  `;propose ban @John Spamming in #general`  
