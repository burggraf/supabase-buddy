import { IonSelect, IonSelectOption, IonPopover, PopoverOptions } from '@ionic/react';
import './ColumnType.css';

interface ContainerProps {
    stateVariable: object;
    stateFunction: Function;
}

const ColumnType: React.FC<ContainerProps> = ({ stateVariable, stateFunction }) => {
    // const customPopoverOptions = {
    // header: 'Column Type',
    // subHeader: 'Select a column type',
    // message: 'choose from available PostgreSQL data types'
    // };
  return (
    <IonSelect
    // interfaceOptions={customPopoverOptions}
    // interface="popover"
    // see https://ionicframework.com/docs/api/alert#alertoptions
    interfaceOptions={{header: 'Column Type'/*, subHeader: 'subHeader', message: 'message'*/}}
    placeholder="Select Type"
    cancelText="Cancel"
    okText="OK"
    onIonChange={e => stateFunction(e.detail.value)}
    value={stateVariable}>
    <IonSelectOption value="text">text</IonSelectOption>
    <IonSelectOption value="numeric">numeric</IonSelectOption>
    <IonSelectOption value="int2">int2</IonSelectOption>
    <IonSelectOption value="int4">int4</IonSelectOption>
    <IonSelectOption value="int8">int8</IonSelectOption>
    <IonSelectOption value="float4">float4</IonSelectOption>
    <IonSelectOption value="float8">float8</IonSelectOption>
    <IonSelectOption value="json">json</IonSelectOption>
    <IonSelectOption value="jsonb">jsonb</IonSelectOption>
    <IonSelectOption value="varchar">varchar</IonSelectOption>
    <IonSelectOption value="uuid">uuid</IonSelectOption>
    <IonSelectOption value="date">date</IonSelectOption>
    <IonSelectOption value="time">time</IonSelectOption>
    <IonSelectOption value="timetz">timetz</IonSelectOption>
    <IonSelectOption value="timestamp">timestamp</IonSelectOption>
    <IonSelectOption value="timestamptz">timestamptz</IonSelectOption>
    <IonSelectOption value="bool">bool</IonSelectOption>
    {/* <IonSelectOption value="text">text - variable unlimited length text</IonSelectOption>
    <IonSelectOption value="numeric">numeric - any numeric entry</IonSelectOption>
    <IonSelectOption value="int2">int2 - signed two-byte integer</IonSelectOption>
    <IonSelectOption value="int4">int4 - signed four-byte integer</IonSelectOption>
    <IonSelectOption value="int8">int8 - signed eight-byte integer</IonSelectOption>
    <IonSelectOption value="float4">float4 - single precision floating point number 4-bytes</IonSelectOption>
    <IonSelectOption value="float8">float8 - double precision floating point number 8-bytes</IonSelectOption>
    <IonSelectOption value="json">json - textual JSON data</IonSelectOption>
    <IonSelectOption value="jsonb">jsonb - binary JSON data, decomposed</IonSelectOption>
    <IonSelectOption value="varchar">varchar - variable length character string</IonSelectOption>
    <IonSelectOption value="uuid">uuid - universally unique identifier</IonSelectOption>
    <IonSelectOption value="date">date - calendar date (year, month, day)</IonSelectOption>
    <IonSelectOption value="time">time - time of day (no time zone)</IonSelectOption>
    <IonSelectOption value="timetz">timetz - time of day (including time zone)</IonSelectOption>
    <IonSelectOption value="timestamp">timestamp - date and time (no time zone)</IonSelectOption>
    <IonSelectOption value="timestamptz">timestamptz - date and time (including time zone)</IonSelectOption>
    <IonSelectOption value="bool">bool - logical boolean (true/false)</IonSelectOption> */}
  </IonSelect>

);
};

export default ColumnType;
