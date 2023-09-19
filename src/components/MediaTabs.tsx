import { useState } from "react";

interface MediaTabsProps{
  tabs: Array<{
    title: string,
    element: JSX.Element
  }>
}

export default function MediaTabs({tabs}:MediaTabsProps){
  const [active, setActive] = useState<number>(0);

  function onChange(newActive:number){
    if(active === newActive){
      return;
    }

    if(tabs[newActive]){
      setActive(newActive);
    }
  }

  return (
    <div className="media-extra">
      <div className="head">
        {
          tabs.map((v, i) => {
            return (
              <p
              key={i}
              onClick={() => onChange(i)}
              className={i === active ? "active" : ""}>{v.title}</p>
            )
          })
        }
      </div>

      {tabs[active].element}
    </div>
  )
}