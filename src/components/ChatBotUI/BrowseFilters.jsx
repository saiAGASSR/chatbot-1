const { useState, useRef } = require("react");
import { X } from 'lucide-react'; // for modern close icon
import QuickPrompts from './QuickPrompts';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import filtersConfig from './../../../filters.json';


const BrowseFilters = ({title , data ,setBrowseButtonsClicked ,sendMessage ,isTyping ,projectId })=>{
    const [selectedType , setSelectedType] = useState('language');
    const [showAlert,setShowAlert] = useState(false);

    const fancyArray = filtersConfig["fancy_queries"]
    console.log("🚀 ~ BrowseFilters ~ fancyArray:", fancyArray)

    const multipleFancyArray = filtersConfig["multiple_selection_fancy_choice"];
    

    const selectedBgColor = 'bg-gradient-to-br from-white via-blue-50 to-blue-100 '
    const browseButtonsStyling = ' px-4 py-2 w-fit text-xl font-bold  tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white rounded-lg'
    const values = data;
    values.showPartners;

            
                           

    const [options,setOptions] = useState(values);


    const languageOptions = options.filter(item=> item.type == 'language');
    // const selectedLanguageOptions = options.filter(item=> (item.type == 'language' && item.selected));
    const selectedLanguageOptions = languageOptions.filter(item=> (item.selected));
    const selectedLanguageOptionsLeangth = selectedLanguageOptions.length;
    console.log("🚀 ~ BrowseFilters ~ selectedLanguageOptionsLeangth:", selectedLanguageOptionsLeangth)

    


    console.log("selectedGenreOptions",selectedLanguageOptions);
    
    const genreOptions = options.filter(item=> item.type == 'genre');
    // const selectedGenreOptions = options.filter(item=> (item.type == 'genre' && item.selected));
    const selectedGenreOptions = genreOptions.filter(item=> (item.selected));
    const selectedGenreOptionsLength = selectedGenreOptions.length;
    console.log("🚀 ~ BrowseFilters ~ selectedGenreOptionsLength:", selectedGenreOptionsLength)

    const partnerOptions = options.filter(item=> item.type == 'partner');
    const selectedPartnerOptions = partnerOptions.filter(item=>(item.selected));
    const selectedPartnerOptionsLength = selectedGenreOptions.length;
    console.log("🚀 ~ BrowseFilters ~ selectedPartnerOptionsLength:", selectedPartnerOptionsLength)




    console.log("selectedGenreOptions",selectedGenreOptions);
    
    console.log("options",options);
    let contentType;

    if(title == 'Browse Movies')
        {
        contentType = 'movies'
        }
        if(title == 'Browse TvSeries'){
        contentType = 'tvSeries'
        }
        if(title == 'Browse Live'){
        contentType = 'live'
        }

        
    const handleSubmit = ()=>{
            console.log("handle submit called");
            
            let finalQuery;
            let finalfancytest;


            let languageLimit= selectedLanguageOptionsLeangth >= 5;
            let genresLimit= selectedGenreOptionsLength >= 5;
            let partnersLimit= selectedPartnerOptionsLength >= 5;

            if((languageLimit || genresLimit || partnersLimit ))  {
            setShowAlert(true);
            return;
            };

            let selectedLanguageArray = []; 
            selectedLanguageOptions.map(item=>{
            selectedLanguageArray.push(item.value)
            })

            const selectedLanguages = selectedLanguageArray.join(",");

            let selectedGenreArray = []; 
            selectedGenreOptions.map(item=>{
            selectedGenreArray.push(item.value)
            })

            const selectedGenres = selectedGenreArray.join(",");

            let selectedPartnersArray = [];
            selectedPartnerOptions.forEach(element => {

            selectedPartnersArray.push(element.value)

            });

            const selectedPartners = selectedPartnersArray.join(",")

            console.log("submit from filters");
            
            
            console.log("");
            
            let randomFancyText = fancyArray[Math.floor((Math.random() * 4))]
            console.log("🚀 ~ handleSubmit ~ randomFancyText:", randomFancyText)
            
            let backendSelectionGenreQueryKey = (selectedGenreArray.length !=0 ) ? `|genre-${selectedGenres}` : '';
            let backendSelectionLanguageQueryKey = (selectedLanguageArray.length !=0 ) ? `|language-${selectedLanguages}` : '';
            let backendSelectionPartnerQueryKey = (selectedPartnersArray.length != 0) ? `|partner-${selectedPartners}` : '';

            
            

            finalQuery =`B33|contenttype-${contentType}|${backendSelectionGenreQueryKey}${backendSelectionLanguageQueryKey}${backendSelectionPartnerQueryKey}`

            
            if(selectedGenreArray.length > 1 || selectedLanguageArray.length > 1 || selectedPartnersArray.length > 1)
            {
                    finalfancytest =  multipleFancyArray[Math.floor(Math.random() * multipleFancyArray.length)]
            } 
                else
            {
                let fancyQuery = 'Awesome choice ';
                let ott = 'Awesome choice! You’re into   in English and Hindi '

                if(selectedGenreArray.length != 0){

                fancyQuery =   fancyQuery + " " + ` in ${selectedGenres} ` 
                }
                if(selectedLanguageArray.length != 0){

                fancyQuery = fancyQuery + "movies" + " " +  `in ${selectedLanguages}` +  " "
                }

                if(selectedPartnersArray.length != 0){
                fancyQuery +=  " " +  `and specific ${selectedPartners} partners` + " ";
                }

                fancyQuery += `— give me a sec while I find the best picks for you.`;
                console.log("replacedString",randomFancyText.replace("Mystery" , selectedGenres));
                console.log("replacedString",randomFancyText.replace("English" , selectedLanguages));
                console.log("replacedString",randomFancyText.replace("Amazon Prime Video" , selectedPartners));
                console.log("replacedString",randomFancyText.replace("movies" , contentType));
                console.log("replacedString final",randomFancyText);
                console.log("replacedString final",randomFancyText.replace("movie",contentType).replace("Mystery",selectedGenres).replace("English",selectedLanguages).replace("Amazon Prime Video",selectedPartners));
                
                let Fancygenre ;
                if(selectedGenreArray.length > 0 ){
                    Fancygenre = randomFancyText.replace("Mystery",selectedGenres)
                }
                else{
                    Fancygenre = randomFancyText.replace("Mystery","")
                }

                let fancyLanguage;
                if(selectedLanguageArray.length > 0){
                    fancyLanguage = Fancygenre.replace("English",selectedLanguages)
                }else{
                    fancyLanguage = Fancygenre.replace("English","")
                }

                

                let fancypartner;
                if(selectedPartnersArray.length > 0){
                    fancypartner = fancyLanguage.replace("from  Amazon Prime Video partner",` from  ${selectedPartners}`)
                }else{
                    fancypartner = fancyLanguage.replace("from  Amazon Prime Video partner", "");
                }

                finalfancytest = fancypartner.replace("movies",contentType)

                let finalFancyReplacedQuery = randomFancyText.replace("movie",contentType).replace("Mystery",selectedGenres).replace("English",selectedLanguages).replace("from  Amazon Prime Video partners",selectedPartners);
            }

            console.log("finalQuery",finalQuery);
            console.log("finalfancytest",finalfancytest);
            const finalTrimmedQuery = finalQuery.trim();
            sendMessage(finalTrimmedQuery , finalfancytest , 'browseFilterOptions')
            setBrowseButtonsClicked(false);

    }

    


    
    const handleSelectedFilters = (key)=>{

            setOptions((prevState)=>{
                const updating = [...prevState];
                const updated = updating.map(item=>{
                    if(item.value == key){
                        return {...item, selected : !item.selected}
                    }
                    else{
                        return item;
                    }
                })
                return updated
                
            })
    }

    let filtersBySelectedType ;
    if(selectedType == 'language'){
        filtersBySelectedType = languageOptions
    }

    if(selectedType == 'genre'){
        filtersBySelectedType = genreOptions
    }
    if(selectedType == 'partner'){
        filtersBySelectedType = partnerOptions
    }



    


    return(
        <div className="absolute bottom-0  flex flex-col    bg-gray-950 w-full lg:h-max z-[50] left-0  gap-1 rounded-lg">
                {   showAlert && 
                    <div className='w-max'>
                        <Alert severity="warning" onClose={() => {setShowAlert(false)}}>
                                You have selected more that 5 options plaese select 5 or less that 5
                        </Alert>
                    </div>
                }

                <div className="mt-3 ml-5 flex items-center h-max">
                        <div className='w-full '>
                        
                            <h1 className="text-xl font-bold leading-none tracking-tight text-white md:text-2xl lg:text-2xl dark:text-white">{title}</h1>


                        </div>

                        <div className='w-10 p-1 items-center'>
                                                <button className="text-red-500 hover:text-red-750" onClick={()=>{setBrowseButtonsClicked(false)}}>  <X className="w-5 h-5 " /></button>
                        </div>
                </div>

             
                <div className="ml-2 flex gap-5 h-max">

                    <button className={`${browseButtonsStyling}  ${selectedType == 'language' ? 'text-green-700' : 'text-white'}`} onClick={()=>setSelectedType('language')}>Language</button>
                    <button className={`${browseButtonsStyling}  ${selectedType == 'genre' ? 'text-green-700' :'text-white'}`} onClick={()=>setSelectedType('genre')}>Genre</button>

                    {true && <button className={`${browseButtonsStyling} ${selectedType == 'partner' ? 'text-green-700' :'text-white'}`} onClick={()=>setSelectedType('partner')}>Partners</button>}


                </div>

                <div className='flex h-55 overflow-y-auto no-scrollbar'>

                
                    <QuickPrompts  itemss={filtersBySelectedType} changeSelection={handleSelectedFilters} />



                </div>




                

                <div className="w-full  p-3 flex justify-center bg-grey-900">
                    

                    <button disabled={isTyping} className={`text-lg font-semibold  tracking-tight text-gray-900 md:text-2xl lg:text-lg dark:text-white bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full `} onClick={handleSubmit}>{`Lets Roll into ${contentType === 'tvSeries' ? 'Shows' : contentType}`}</button>


                </div>




                

        </div>
    )

}

export default BrowseFilters;