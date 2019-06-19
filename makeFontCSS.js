var Folder = "./";
const fs = require('fs');
const fs2 =  require('fs');
const path = require('path');
const term = require( 'terminal-kit' ).terminal 

const CSSFileName = 'font.css';


const Font = {
    localName_1 : "",
    localName_2 : "",
    family : "",
    file: "",
    isItalic : false,
    weight: 0,
    type: "",
}

const fileExtentions = [".ttf", ".otf", ".woff", ".woff2", ".svg", ".eot"];

term.blue.bold("\t Willkommen bei [Keine Idee für nen Projektnamen] ;-)\n");
term.blue("Bitte gebe den Ordner an, der die Font-Files enthält \noder wähle im Ordner ein Font-File aus\n (Schnellauswahl mit Tab): ")
selectPath()






/**
 *  Functions
 */

function confirmPath(fontPath) {
	term( 'Möchstest Du diesen Pfad nutzten [Y|n]\n' ) ;
	
	// Exit on y and ENTER key
	// Ask again on n
	term.yesOrNo( { yes: [ 'y' , 'ENTER' ] , no: [ 'n' ] } , function( error , result ) {
	
		if ( result ) {
            term.green( "OK \nBeginne CSS File zu bauen\n" ) ;
            generateCSS(fontPath);
		}
		else {
			term.blue( "Tschüss " ) ;
			process.exit() ;
        }
        
	} ) ;
}


function selectPath(){
    term.fileInput(
        { baseDir: '../' } ,
        function( error , input ) {
            if ( error )
            {
                term.red.bold( "\nAn error occurs: " + error + "\n" ) ;
            }
            else
            {
                term.blue( "\nDu hast folgenden Pfad ausgewählt: ") ;
                term.blue.bold(input + "\n")
                setTimeout(function(){
                    confirmPath(input);
                }, 500)
            }
        }
    ) ;
}

function generateCSS(fontPath){

    
    // Is DIR or File in DIR
    if (is_dir(fontPath)){
        Folder = fontPath
    }else{
        Folder = path.dirname(fontPath);
    }


    fs.unlink(Folder + "/" + CSSFileName, (err)=>{
        // if (err){
        //     console.error(err);
        // }
    })

    var cssString = ""

    fs.readdir(Folder, (err, files) =>{
        files.forEach(function(file, i){
            var fontType = fileExtentions.indexOf(path.extname(file));
            //console.log(i + " of " + files.length);

            

            if(fontType > -1){
    
                var current_Font = JSON.parse(JSON.stringify(Font));
                var fileName = path.parse(file).name
                current_Font.file = file;
    
                const typeExp = /(\bBlack.*)|(\bBold.*)|(\bLight.*)|(\bHeavy.*)|(\bMedium.*)|(\bRegular.*)|(\bSemibold.*)|(\bThin.*)|(\bUltra.*)/g
                var fontPropertyRAW = fileName.match(typeExp)[0];
                
    
                current_Font.family = fileName.replace(fontPropertyRAW, '').replace(/-/g, "");
                current_Font.localName_1 = fileName.replace(/-/g, " ").replace("Italic", " Italic");
                current_Font.localName_2 = current_Font.family + "-" + fontPropertyRAW;
                
    
                switch (true){
                    case /Ultra/.test(fontPropertyRAW):
                        current_Font.weight = 100;
                        break;
                    case /Thin/.test(fontPropertyRAW):
                        current_Font.weight = 200;
                        break;
                    case /Light/.test(fontPropertyRAW):
                        current_Font.weight = 300;
                        break;
                    case /Regular/.test(fontPropertyRAW):
                        current_Font.weight = 400;
                        break;
                    case /Medium/.test(fontPropertyRAW):
                        current_Font.weight = 500;
                        break;
                    case /Semibold/.test(fontPropertyRAW):
                        current_Font.weight = 600;
                        break;
                    case /Bold/.test(fontPropertyRAW):
                        current_Font.weight = 700;
                        break;
                    case /Heavy/.test(fontPropertyRAW):
                        current_Font.weight = 800;
                        break;
                    case /Black/.test(fontPropertyRAW):
                        current_Font.weight = 900;
                        break;
                    default:
                        current_Font.weight = 400;
                        break;
                }
    
    // If italic 
                if (/Italic/.test(fontPropertyRAW)){
                    current_Font.isItalic = true;
                }


                switch(fontType){
                    case 0:
                        current_Font.type = "truetype";
                        break;
                    case 1:
                        current_Font.type = "opentype";
                        break;
                    case 2:
                        current_Font.type = "woff";
                        break;
                    case 3:
                        current_Font.type = "woff2";
                        break;
                    default: 
                        current_Font.type = null
                }
    
                
    
                cssString = `
@font-face {
font-family: '`+ current_Font.family+`';
src: local('` + current_Font.localName_1 + `'), local('` + current_Font.localName_2 + `'),
    url('` + current_Font.file + `') ` + (current_Font.type ? "format('"+ current_Font.type +"')" : "") + `;
font-weight: ` + current_Font.weight + `;
font-style: ` + (current_Font.isItalic ? "italic" : "normal") + `;
}
    ` + cssString;
                //console.log(cssString);
                
                
            }

            if (i == (files.length - 1)){
                
                fs.appendFile(Folder +"/"+ CSSFileName, cssString, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    term.blue("Das CSS File ist gebaut!\n");
                    term.green.bold("Fertig!\n");
                    process.exit();
                }); 
                
            }
        })
    })

    

    
    
}

function is_dir(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

/**
 * NOTES 
 */

// 
// @font-face {
//     font-family: 'SFProDisplay';
//     src: local('SF Pro Display Ultralight Italic'), local('SFProDisplay-UltralightItalic'),
//         url('SFProDisplay-UltralightItalic.ttf') format('truetype');
//     font-weight: 200;
//     font-style: italic;
// }


/*
    100 = ultra
    200 = thin
    300 = light
    400 = Reg
    500 = Medium
    600 = semibold 
    700 = bold
    800 = heavy
    900 = black
 */