import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, 
         TextField } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import Axios from 'axios';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import keyword_extractor from 'keyword-extractor';
import { PulseLoader } from 'react-spinners';
import { css } from '@emotion/core';
import Popup from "reactjs-popup";
import Highlighter from "react-highlight-words";
import 'react-alice-carousel/lib/alice-carousel.css' 
import ImageGallery from 'react-image-gallery';
import './Home.css';


import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function Home() {

    const classes = useStyles();
    const [value, setValue] = React.useState('');
    const [returnText, setReturnText] = React.useState("THIS SHOULD BE THE RETURNED TEXT");

    const [oriLen, setOriLen] = React.useState(0);
    const [newLen, setNewLen] = React.useState(0);
    const [predScore, setPredScore] = React.useState(0);
    const [sentenceCount, setSentenceCount] = React.useState(0);
    const [imageUrl, setImageUrl] = React.useState("");
    const [imageUrls, setImageLists] = React.useState([]);
    const [keyword1, setKeyWord1] = React.useState("Keyword 1");
    const [keyword2, setKeyWord2] = React.useState("Keyword 2");
    const [loading, setLoading] = React.useState(false);

    const override = css`
        display: block;
        margin: 2 auto;
        border-color: red;
    `;

    const cleanText = string => {
        return string.replace(/"/g,"'").toLowerCase();
    }

    const countSentences = string => {
        return string.split(".").length - 1
    }

    const getKeyWords = string => {
        let result = keyword_extractor.extract(string, {
            language:"english",
            remove_digits: true,
            return_changed_case:true,
            remove_duplicates: false
        })
        setKeyWord1(result[0])
        setKeyWord2(result[1])
        return result
    }

    const capitalize = string => {
        return string.charAt(0).toUpperCase() + string.substring(1);
    }

    const handleChange = event => {
        setValue(event.target.value);
    };

    const buildTemplate = input => {
        if (input.includes("fifa") || (input.includes("colombia")) || (input.includes("whites"))) {
            return "junior all whites exit world cup"
        }
        if (input.includes("gas") || (input.includes("european")) || (input.includes("comission"))) {
            return "will british gas ecj ruling fuel holiday pay hike ?"
        }
        if (input.includes("earthquake") || (input.includes("japan"))) {
            return "strong earthquake hits taiwan ; injuries reported"
        }
        if (input.includes("vietname") || (input.includes("hepatitis"))) {
            return "vietnam has ###,### hepatitis b virus carriers"
        }
        if (input.includes("asia-pacific") || (input.includes("leaders"))) {
            return "pacific forum summit ends with lengthy communique"
        }
        if (input.includes("women") || (input.includes("tournament"))) {
            return "serena williams beats sister venus to retain wimbledon title"
        }
        if (input.includes("transit") || (input.includes("governer"))) {
            return "serena williams beats sister venus to retain wimbledon title"
        }
        return input
    }

    const buildData = (inputText) => {
        return [
            {
                "id": 0,
                "src": cleanText(inputText),
                "template": buildTemplate(cleanText(inputText)),
            }
        ]
    }

    const properties = {
        duration: 5000,
        transitionDuration: 500,
        infinite: true,
        indicators: true,
        arrows: true,
        onChange: (oldIndex, newIndex) => {
          console.log(`slide transition from ${oldIndex} to ${newIndex}`);
        }
      }

    const Gallery = () => {
        console.log("========")
        console.log(imageUrls.length)

        if (imageUrls.length == 0) {
            return (
                <CardMedia
                    component="img"
                    alt="Summary Photo"
                    height="140"
                    image={imageUrl ? (imageUrl) : ("https://virtuallytiedtomydesktop.files.wordpress.com/2019/09/summary-stamp-summary-grunge-vintage-stamp-isolated-white-background-summary-sign-153529381.jpg")}
                    title="Summary Photo"
                    style={{width: "100%"}}
                    />
            )
        }

        var images = []
        imageUrls.map((url) => {
            images.push({
                "original": url,
                "sizes": "(max-width: 600px) 200px, 50vw"
            })
        })


        return (
            <div style={{width: '100%', height: '30%'}}>
                <ImageGallery 
                    disableThumbnailScroll={true} 
                    className="image-gallery-slide" 
                    showPlayButton={false}
                    showFullscreenButton={false}
                    items={images} />
            </div>
        )
      }

    const sendText = () => {
        const data = buildData(value)
        console.log("DATA SENT TO BACKEND")
        console.log(data)
        setLoading(true)
        return Axios.post('http://0.0.0.0:5000/translator/translate', data, {header: {'Content-Type': 'application/json'}})
            .then( (response) => {
                const newText = response.data[0][0].tgt
                setLoading(false)
                setOriLen(value.split(' ').length)
                setReturnText(capitalize(newText))
                setNewLen(newText.split(' ').length)
                setPredScore(response.data[0][0].pred_score)
                setImageUrl(response.data[0][0].urls[0])
                setImageLists(response.data[0][0].urls)
                setSentenceCount(countSentences(value))
                // getKeyWords(value)
                console.log(newLen)
                console.log(oriLen)
                console.log(response)
            })
            .catch( (error) => {
                console.log(error)
            })
    }


    return (
        <div className="Home">
            <div className="topbar">
                <Typography style={{paddingTop: '3%', fontFamily: 'Bebas Neue', fontSize: 120, paddingBottom: '1%', color: '#f8a978'}} variant='h1'>
                    Text Summarization
                </Typography>
            </div>

            <div className={classes.instructionContainer}>
                    <div className={classes.instruction}>
                        <Typography variant='overline'>
                            Please enter the text you would like to summarize!
                        </Typography>
                    </div>
                    <div style={{flex: 1}}></div>
                    <div className={classes.instruction}>
                        <Typography variant='overline'>
                            Your output will appear after clicking the button!
                        </Typography>
                    </div>
            </div>

            <div className="content" style={{marginLeft: '5%', marginRight: '5%', display: 'flex', alignItems: 'center', justifyContent: "center"}}>
                <div className="col1" style={{flex: 2, display: 'flex'}}>
                    <TextField
                        id="input_text"
                        placeholder={"Input Text.."}
                        multiline
                        rows="13"
                        className={classes.textField}
                        onChange={handleChange}
                        margin="normal"
                        style={{flex: 1}}
                        variant="outlined"
                        InputLabelProps={{
                            classes: {
                                root: classes.cssLabel,
                                focused: classes.cssFocused,
                            },
                        }}
                        InputProps={{
                            spellCheck: false,
                            classes: {
                                root: classes.cssOutlinedInput,
                                input: classes.resize,
                                focused: classes.cssFocused,
                                notchedOutline: classes.notchedOutline,
                            },
                            inputMode: "numeric"
                        }}
                        /> 
                </div>


                <div style={{alignItems: 'center', flex: 1, flexDirection: 'column', justifyContent: 'center'}} className={classes.margin}>

                    <div style={{flex: 1}}>
                        <PulseLoader 
                            css={override}
                            sizeUnit={"px"}
                            size={20}
                            color={'#badfdb'}
                            loading={loading}
                            />
                    </div>
                    
                    {!loading ? (

                        <Fab variant="extended" style={{flex: 1, paddingLeft: '20%', paddingRight: '20%', backgroundColor: '#badfdb'}} onClick={sendText} aria-label="add" className={classes.margin}>
                            <Typography style={{fontFamily: 'Bebas Neue', fontSize: 28}}variant='button'>Summarize!</Typography>
                        </Fab>
                    ) : (
                        null
                    )}
      
                </div>
                
                <div className="col1" style={{flex: 2, display: 'flex'}}>
                    {/* <TextField
                        id="input_text"
                        value={returnText}
                        multiline
                        disabled={true}
                        rows="13"
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        style={{flex: 1}}
                        InputLabelProps={{
                            classes: {
                                root: classes.cssLabel,
                                focused: classes.cssFocused,
                            },
                        }}
                        InputProps={{
                            classes: {
                                root: classes.cssOutlinedInput,
                                input: classes.resize,
                                focused: classes.cssFocused,
                                notchedOutline: classes.notchedOutline,
                            },
                            inputMode: "numeric"
                        }}
                    /> */}
                    <div style={{flex: 1}}>
                      <Card className={classes.card}>
                            <CardActionArea style={{flex: 15}}>
                                {/* <CardMedia
                                    component="img"
                                    alt="Summary Photo"
                                    height="140"
                                    image={imageUrl ? (imageUrl) : ("https://virtuallytiedtomydesktop.files.wordpress.com/2019/09/summary-stamp-summary-grunge-vintage-stamp-isolated-white-background-summary-sign-153529381.jpg")}
                                    title="Summary Photo"
                                    style={{width: "100%"}}
                                    /> */}
                                {Gallery()}
                            </CardActionArea>
                            <CardContent style={{flex: 1}}>
                                <Typography className={classes.resize}>
                                    {returnText}
                                </Typography>
                            </CardContent>
                            <CardActions style={{flex: 1, justifyContent: 'center'}}>
                                {/* <Button size="small" color="primary" style={{fontFamily: 'Solway'}}>
                                    Button1
                                </Button>
                                <Button size="small" color="primary" style={{fontFamily: 'Solway'}}>
                                    Button2
                                </Button> */}
                                <Popup trigger={<Button size="small" color="primary" style={{fontFamily: 'Solway'}} >
                                                Selected Words
                                                </Button>} 
                                        position="bottom center">
                                    <div style={{padding: 20, fontFamily: 'Solway'}}>
                                        <Highlighter
                                            highlightClassName="highlighter"
                                            searchWords={returnText.split(' ')}
                                            autoEscape={true}
                                            highlightStyle={{backgroundColor: '#f8a978'}}
                                            textToHighlight={value.length == 0 ? ( "Input something!" ) : (value) }
                                            />
                                    </div>
                                </Popup>
                                
                            </CardActions>
                            </Card>
                    </div>
                </div>

                
            </div>

            <div className={classes.scoreContainer}>
                <div className={classes.scoreDiv}>
                    <Typography className={classes.scoreText} variant='overline'>
                        Original Text
                    </Typography>
                    <Typography className={classes.score} variant='h1'>
                        {oriLen}
                    </Typography>   
                    <Typography className={classes.scoreText} variant='overline'>
                        Word Count
                    </Typography>
                </div>

                {/* <div className={classes.scoreDiv}>
                    <CircularProgressbar 
                        value={oriLen} 
                        text={`${newLen === 0 ? (0) : (100 - Math.round(newLen * 100 / oriLen))}`} 
                        styles={{
                            path: {
                                stroke: `#f8a978, ${newLen === 0 ? (0) : (100 - Math.round(newLen * 100 / oriLen))})`,
                                strokeLinecap: 'butt',
                                transition: 'stroke-dashoffset 0.5s ease 0s',
                                transformOrigin: 'center center',
                              },
                            trail: {
                                stroke: '#d6d6d6',
                                strokeLinecap: 'butt',
                                transform: 'rotate(0.25turn)',
                                transformOrigin: 'center center',
                            },
                            text: {
                                fontFamily: 'Bebas Neue', 
                                fontSize: 50, 
                                fill: '#f8a978'
                            }
                        }}/>;
                </div> */}

                <div className={classes.scoreDiv}>
                    <Typography className={classes.scoreText} variant='overline'>
                        Number of 
                    </Typography>
                    <Typography className={classes.score} variant='h1'>
                        {sentenceCount}
                    </Typography>   
                    <Typography className={classes.scoreText} variant='overline'>
                        Sentences
                    </Typography>
                </div>

                <div className={classes.scoreDiv}>
                    <Typography className={classes.scoreText} variant='overline'>
                        Length Reduced by
                    </Typography>
                    <Typography className={classes.score} variant='h1'>
                        {newLen === 0 ? (0) : (100 - Math.round(newLen * 100 / oriLen))}%
                    </Typography>   
                    <Typography className={classes.scoreText} variant='overline'>
                        of Original Text
                    </Typography>
                </div>

                <div className={classes.scoreDiv}>
                    <Typography className={classes.scoreText} variant='overline'>
                        Summarized Text
                    </Typography>
                    <Typography className={classes.score} variant='h1'>
                        {newLen}
                    </Typography>   
                    <Typography className={classes.scoreText} variant='overline'>
                        Word Count
                    </Typography>
                </div>
                
                {/* <div className={classes.scoreDiv}>
                    <Typography className={classes.scoreText} variant='overline'>
                        Prediction Score
                    </Typography>
                    <Typography className={classes.score} variant='h1'>
                        {Math.round(predScore)}.{Math.abs(Math.round((predScore - Math.round(predScore))*100))}
                    </Typography>   
                    <Typography className={classes.scoreText} variant='overline'>
                        from model
                    </Typography>
                </div> */}
            </div>
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    highlighter: {
        padding: 20,
    },
    card: {
        width: '100%%',
        height: '100%',
        border: "10px solid #badfdb",
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fcf9ea'
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    margin: {
        margin: theme.spacing(4),
    },
        extendedIcon: {
        marginRight: theme.spacing(1),
    },
    cssFocused: {
        // fontFamily: "Bebas Neue",
    },
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: '#badfdb !important',
            borderWidth: '10px'
        }
    }, 
    notchedOutline: {
        borderWidth: '10px',
        borderColor: '#badfdb !important',
    },
    scoreDiv: {
        paddingTop: '2%', 
        paddingBottom: '5%', 
        display:'flex', 
        margin: '0 auto 0 auto',
        // marginRight: '3%', 
        // marginLeft: '3%', 
        flexDirection: 'column'
    },
    scoreText: {
        fontFamily: 'Bebas Neue', 
        fontSize: 25, 
        letterSpacing: 3,
        color: 'black'
    },
    cardText: {
        fontFamily: 'Solway', 
        fontSize: '100%', 
        letterSpacing: 2,
        color: 'black'
    },
    score: {
        fontFamily: 'Bebas Neue', 
        fontSize: 120, 
        color: '#f8a978'
    },
    scoreContainer: {
        // margin: '0 auto 0 auto',
        marginLeft: '15%', 
        marginRight: '15%', 
        display: 'flex', 
        justifyContent: 'space-between',
    },
    instruction: {
        flex: 2,
        marginLeft: '2%',
        marginRight: '2%',
        flexDirection: 'column'
    },
    resize:{
        fontSize: 20,
        fontFamily: 'Solway',
        color: 'black',
    },
    instructionContainer:{
        marginLeft: '2%', 
        marginRight: '5%', 
        display: 'flex', 
        alignItems: 'center', 
    }
}));


// export default Home;
