import { useEffect, useState } from "react"
import "../../styles.css"

export default function ZoomAdjuster({ zoomAmount, setZoomAmount}) {

    const [ zoomToggled, setZoomToggled ] = useState(false);

    useEffect(() => {
        document.body.style.zoom = zoomAmount;
        document.body.style.setProperty('--zoom-factor', zoomAmount);
    }, [zoomAmount])

    return (
        <div>
            <button className="zoom-toggle"><img src="/images/magnifiying-glass.png" onClick={() => setZoomToggled(oldToggle => !oldToggle)} /></button>
            {!zoomToggled &&
                <div className="zoom-button-container">
                    <button onClick={() => setZoomAmount(oldZoom => oldZoom + .15)}><img src="/images/plus.png" /></button>
                    <button onClick={() => setZoomAmount(oldZoom => oldZoom - .15)}><img src="/images/minus.png" /></button>
                    <button className="zoom-reset-button" onClick={() => setZoomAmount(1)}>Reset</button>
                </div>}
        </div>
    )
}