import React from 'react';
import QuickPromptsPartners from './QuickPromptsPartners';

const QuickPrompts = ({itemss , changeSelection}) => {

  console.log(itemss,"items in quick Prompts");
  
  // const items = [
  //   "Action", "Thriller", "Sci-Fi", "Adventure",
  //   "Comedy", "Horror", "Fantasy", "Crime", 
  //   "Drama", "Romance", "Mystery", "Documentary"
  // ];
  const items = [];
  itemss.map(item=>{
    items.push(item.value)
  })
  const selectedBgColor = 'bg-gradient-to-br from-white via-blue-50 to-blue-100 '


  const selectedItems = itemss.filter(item=>item.selected);
  const partners = itemss.filter(item=>item.type == 'partner');
  console.log("partners",partners);
  
  const selectedItemsArray = [];
  selectedItems.forEach(element => {
    selectedItemsArray.push(element.value)
  });
  console.log("selectedItems",selectedItemsArray);
  
  

  // Split items into rows of 4
  const rows = [];
  for (let i = 0; i < items.length; i += 4) {
    rows.push(items.slice(i, i + 4));
  }
  if(partners.length > 0){
    return <QuickPromptsPartners partners={partners} changeSelection={changeSelection}/>
  }

  return (
    <div className=" text-white p-1 w-full h-max">
      {/* <p className="font-semibold mb-4 text-lg">Quick Prompts</p> */}

      <div className="overflow-x-auto  overflow-y-auto  no-scrollbar h-max">
        <div className="space-y-3 w-fit">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-3 ">
              {row.map((item, index) => (
                <button
                  key={index}
                  className={`bg-transparent border border-gray-500 rounded-lg px-3 py-1.5 ${ selectedItemsArray.includes(item) ? 'text-black' : 'text-white'} text-sm xl:text-md hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap ${ selectedItemsArray.includes(item) && selectedBgColor}`}
                  style={{ minWidth: 'fit-content' }}
                  onClick={()=>{changeSelection(item)}}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickPrompts;