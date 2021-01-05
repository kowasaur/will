# WiLL
 Bringing Democracy to Discord

***let thy people's will be done***  
 \- some guy probably

[Invite Link](https://discord.com/oauth2/authorize?client_id=794073147288190981&permissions=8&scope=bot)

# Use
The WiLL role must have Adminstrator and be above all other roles to function correctly  
If you want to make a category, make a channel with the type, `category`

# Commands
**Note:** parameters in <> are mandatory and parameters in [] are optional

## ;ping
Ping the bot to check if the bot is still alive

## ;help
List all the available commands or get help for a particular command  
**Usage:** `;help [command]`  
**Example:**  `;help propose role`  

## ;setup
**(Admin Only)** Setup/change bot settings

### ;setup proposals
Change the channel where proposals are sent in  
**Usage:** `;setup proposals <channel>`  
**Example:**  `;setup proposals #proposals`  

### ;setup rules
Change the channel where the rules are posted  
**Usage:** `;setup rules <channel>`  
**Example:**  `;setup rules #rules`  

## ;propose
Propose a change to the server  

### ;propose kick
Kick a user from the server  
**Usage:** `;propose kick <user> [reason]`  
**Example:**  `;propose kick @John Spamming in #general`  

### ;propose ban
Ban a user from the server  
The maximum number of days messages can be deleted from is 7  
**Usage:** `;propose ban <user> [delete message days] [reason]`  
**Example:**  `;propose ban @John 0 Spamming in #general`  

### ;propose emoji
Modify emojis  

#### ;propose emoji create
Create a new emoji  
You *must* attach a image less than 256kb as well  
**Usage:** `;emoji create <name> [reason]`  
**Example:**  `;emoji create hando Make funny memes`  

### ;propose role
Modify a role

#### ;propose role create
Create a new role   
The colour can be any of [these](https://github.com/kowasaur/discordjs-colors/blob/master/docs/COLORS.md) colours or a hexadecimal  
Use hyphens (-) instead of a spaces for the name  
**Usage:** `;propose role create <name> [colour] [position] [mentionable] [hoist] [reason]`  
**Example:**  `;propose role create Gamer green 3 true true We need a role for true gamers`  
After using the command, you will be prompted to write any permissions you want the role to have.
Refer to [here](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS) for the full list of permissions.
Ensure you separate each permission with a comma. If you just want the default permissions, say `none`.  
**Example:** `KICK_MEMBERS, VIEW_AUDIT_LOG, SEND_TTS_MESSAGES, MENTION_EVERYONE`

#### ;propose role give
Give a role to someone  
**Usage:** `;propose role give <user> <role> [reason]`  
**Example:**  `;propose role give @John @Gamer He's a true gamer`  

### ;propose rule
Modify a rule

#### ;propose rule add
Add a rule  
Use hyphens (-) instead of a spaces for the rule  
**Usage:** `;propose rule add <rule> [reason]`  
**Example:**  `;propose rule add No-spamming-on-weekdays Just cause lol`  
