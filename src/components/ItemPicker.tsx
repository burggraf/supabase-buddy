import { IonSelect, IonSelectOption, IonPopover, PopoverOptions, IonButton, IonModal, IonList, IonItem, IonLabel, IonContent, IonHeader, IonToolbar, IonButtons, IonIcon, IonTitle } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import './ItemPicker.css';

interface Option {
  value: string;
  text: string;
}
interface ContainerProps {
    stateVariable: object;
    stateFunction: Function;
    initialValue: string;
    options: Option[];
    title: string;
}

const ItemPicker: React.FC<ContainerProps> = ({ stateVariable, stateFunction, initialValue, options, title }) => {
    // const customPopoverOptions = {
    // header: 'Column Type',
    // subHeader: 'Select a column type',
    // message: 'choose from available PostgreSQL data types'
    // };
    // const [showModal, setShowModal] = useState(false);
    const [showModal, setShowModal] = useState({ isOpen: false });
    const chooseValue = (e: any) => {
      console.log('chooseValue', e);
      setShowModal({ isOpen: false });
      setTimeout(() => {
        stateFunction(e);
      }, 500);
    }
    return (
    <>
        <IonModal 
          isOpen={showModal.isOpen} 
          animated={true} 
          // onDidDismiss={() => setShowModal({ isOpen: false })} 
          className="my-custom-class">
        <IonHeader>
          <IonToolbar>
            <IonTitle>{ title }</IonTitle>
            <IonButtons slot='end'>
              <IonButton color='primary' onClick={() => setShowModal({ isOpen: false })}>
                <IonIcon size='large' icon={closeOutline}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>

          {/* {data.map((e, i) => {
            return <IonItem onClick={() => onClose(i)}>{e + i}</IonItem>;
          })} */}

              {options.map((option) => {
                return (
                  <IonItem key={option.value} onClick={() => chooseValue(option.value) }>
                  <IonLabel className={option.value===initialValue ? 'chosenLabel':'unchosenLabel'}>{option.text}</IonLabel>
                  </IonItem>                  
                )
                }

              )}     
          </IonList>
          <IonButton onClick={() => setShowModal({ isOpen: false })}>{ stateVariable }</IonButton>
        </IonContent>
        </IonModal>
        <IonButton strong expand="block" color="medium" onClick={() => setShowModal({ isOpen: true })}>{stateVariable}</IonButton>
    </>

    // <IonSelect
    // interfaceOptions={{header: 'Column Type'/*, subHeader: 'subHeader', message: 'message'*/}}
    // placeholder="Select Type"
    // cancelText="Cancel"
    // interface="action-sheet"
    // okText="OK"
    // onIonChange={e => stateFunction(e.detail.value)}
    // value={stateVariable}>
    // { value: "text", text: "text" },
    // { value: "numeric", text: "numeric" },
    // { value: "int2", text: "int2" },
    // { value: "int4", text: "int4" },
    // { value: "int8", text: "int8" },
    // { value: "float4", text: "float4" },
    // { value: "float8", text: "float8" },
    // { value: "json", text: "json" },
    // { value: "jsonb", text: "jsonb" },
    // { value: "varchar", text: "varchar" },
    // { value: "uuid", text: "uuid" },
    // { value: "date", text: "date" },
    // { value: "time", text: "time" },
    // { value: "timetz", text: "timetz" },
    // { value: "timestamp", text: "timestamp" },
    // { value: "timestamptz", text: "timestamptz" },
    // { value: "bool", text: "bool" },
    /* 
    { value: "text", text: "text - variable unlimited length text" },
    { value: "numeric", text: "numeric - any numeric entry" },
    { value: "int2", text: "int2 - signed two-byte integer" },
    { value: "int4", text: "int4 - signed four-byte integer" },
    { value: "int8", text: "int8 - signed eight-byte integer" },
    { value: "float4", text: "float4 - single precision floating point number 4-bytes" },
    { value: "float8", text: "float8 - double precision floating point number 8-bytes" },
    { value: "json", text: "json - textual JSON data" },
    { value: "jsonb", text: "jsonb - binary JSON data, decomposed" },
    { value: "varchar", text: "varchar - variable length character string" },
    { value: "uuid", text: "uuid - universally unique identifier" },
    { value: "date", text: "date - calendar date (year, month, day)" },
    { value: "time", text: "time - time of day (no time zone)" },
    { value: "timetz", text: "timetz - time of day (including time zone)" },
    { value: "timestamp", text: "timestamp - date and time (no time zone)" },
    { value: "timestamptz", text: "timestamptz - date and time (including time zone)" },
    { value: "bool", text: "bool - logical boolean (true/false)" }, 
    */
  //</IonSelect>

);
};

export default ItemPicker;
