import Avatar from '@mui/material/Avatar';


const QuickPromptsPartners = ({partners ,changeSelection})=>{
    const selectedBgColor = 'bg-gradient-to-br from-white via-blue-50 to-blue-100 '
    console.log(partners);
    const selectedItemsArray = []
    partners.filter(item =>item['selected']).forEach(element => {
        selectedItemsArray.push(element['value'])
    });
    console.log("🚀 ~ QuickPromptsPartners ~ selectedItemsArray:", selectedItemsArray)
    

    const rows = [];
    for(let i =0 ; i < partners.length ; i +=4 ){
        rows.push(partners.slice(i ,i + 4));
    }
    console.log(rows);
    
    
    return <div className=" text-white p-4 w-full h-full">
      {/* <p className="font-semibold mb-4 text-lg">Quick Prompts</p> */}

      <div className="overflow-x-auto  overflow-y-auto no-scrollbar h-[100%]">
        <div className="space-y-3 w-fit">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-10 mb-5 ml-4 mt-5">
              {row.map((item, index) => (
                <button
                  key={index}
                  className={` mt-2  bg-transparent  rounded-full     whitespace-nowrap ${ selectedItemsArray.includes(item['value']) && 'scale-130 shadow-lg shadow-green-950 border border-solid '}    transition duration-100  ease-in-out`}
                  style={{ maxWidth: 'fit-content' }}
                  onClick={()=>{changeSelection(item['value'])}}
                >
                {console.log("Item source",item['src'])
                }
                  {true ?       
                            <Avatar alt={item['value']} src={item['src']} className='' sx={{ width: 56, height: 56 }} />
                            :
                             item['value']}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
}

export default QuickPromptsPartners;


