

export function SuggestionButtons({ suggestions , istyping  ,sendMessage }) {

  return (
    
    <div className="flex flex-wrap justify-center gap-2 px-4 py-2 mt-3">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sendMessage(s,false,'suggestions');
                  }}
                  className="border border-grey-500 font-semibold font-sans text-white opacity-0.7 text-sm px-4 py-2 rounded-lg hover:scale-105 transition duration-700 ease-in-out  mt-1 "
                  disabled={istyping}
                >
                  {s}
                </button>
              ))}
            </div>
  );
}
