# babbelbot-jquery-plugin
Om op de website te plaatsen

# installatie


```javascript

//jquery verplicht

$('#jouw_element_id').babbelbot({
    babbelbotUrl: 'https://babbelbot.be/api/chatbot/JOUW_UNIEKE_ID',
    accessToken: 'JOUW_ACCESS_TOKEN'
})

```

# opties

- (verplicht) de wit.ai access token die je hebt aangemaakt.

            accessToken :       // default = "",
            
- (verplicht) url van babbelbot.be, deze is te vinden in de embed sectie van de app.              
            
            babbelbotUrl:       // default = ''
            
- onthouden van het gesprek (localstorage).          
            
            saveConversation:   // default = true
            
- achtergrondkleur voor het chatgedeelte.          
            
            botBg:              // default = "#185355"
            
- tekstkleur voor de antwoorden van de chatbot. 

            botColor:           // default = "#fff"
            
- achtergrondkleur voor antwoorden van de gebruiker.
        
            userBg:             // default =  "#4ca78c"
            
- tekstkleur voor de antwoorden van de gebruiker.           
            
            userColor:          // default = "#fff"
            
- achtergrondkleur van het titel gedeelte boven aan het chatscherm.           
            
            titleBg:            // default = "#4ca78c"
            
- tekstkleur van het titel gedeelte boven aan het chatscherm.              
            
            titleColor:         // default = "#fff"
            
- standaard hoogte van het chat gedeelte.              
            
            chatHeight:         // default = "200px"
            
- rand om het chatscherm.             
            
            border:             // default = "none"
            
- rand aan de bovenkant van het input gedeelte van de user.              
            
            inputTopBorder:     // default = "1px solid #dddddd"
            
- rand om snelle opties.   

            quickReplyBorder:   // default = "1px solid #185355"
            
- tekstkleur van snelle opties.  

            quickReplyColor:    // default = "#185355"
            
- optie om scherm standaard open of dicht te zetten.

            standardOpen :      // default = true
            
- titel om boven aan het chat scherm te zetten.            
            
            title :             // default = "Babbelbot"
            
- titel die boven elk antwoord van de chatbot komt te staan.             
            
            botName :           // default = "Babbelbot"
