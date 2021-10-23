import { IonButton, IonIcon, useIonToast } from '@ionic/react'
import { copyOutline } from 'ionicons/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import './Copy.css'

interface ContainerProps {
	text: string
}

const Copy: React.FC<ContainerProps> = ({ text }) => {
    const [presentToast, dismissToast] = useIonToast();

	return (
		<div className="copyButton">
			<CopyToClipboard text={text} onCopy={() => {
                    presentToast({
                        color: 'medium',
                        message: 'Code was copied to clipboard...',
                        cssClass: 'toast',
                        buttons: [{ icon: 'close', handler: () => dismissToast() }],
                        duration: 1000,
                        //onDidDismiss: () => console.log('dismissed'),
                        //onWillDismiss: () => console.log('will dismiss'),
                    })

            }}>
                <IonButton color='light'>
                    <IonIcon icon={copyOutline}></IonIcon>
                </IonButton>
            </CopyToClipboard>
		</div>
	)
}

export default Copy
