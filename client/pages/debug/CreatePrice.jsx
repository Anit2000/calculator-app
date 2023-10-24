import React,{useState} from 'react'
import { navigate } from 'raviger'
import { EmptyState,LegacyCard,Page,Modal,Frame, Listbox,LegacyStack,Icon,TextField, Divider,Text,Button } from '@shopify/polaris';
import { CashDollarMajor,CirclePlusMinor } from '@shopify/polaris-icons';

const CreatePrice = () => {
    const [open,setOpen] = useState(false);
    const [width,setWidth] = useState(0);
    const [height,setHeight] = useState(0);
    const [price,setPrice] = useState(0)
    const [list,setList] = useState([{
        height:"20",
        width:"20",
        price: "100"
    }]);
    const addPrice = () =>{
        let priceData = {
            width: width,
            height:height,
            price: price
        }
        setList((prev => [priceData,...prev]))
    }
  return (
    <Page
        backAction={{
            content: "Pricings",
            onAction: () => {
              navigate("/debug/prices");
            },
          }}
    >
        <Modal
            open={open}
            title="Create New Pricing"
            primaryAction={{
                content:"Save",
                onAction:()=>{console.log('save')}
            }}
            secondaryActions={{
                content:"Cancel",
                onAction:()=>{setOpen(false)}
            }}
        >
            <Modal.Section>
                <Listbox accessibilityLabel='Add pricing value'>
                <Listbox.Option key={"price-headings"} value={"price-headings"} >
                    <div style={{
                        width:"100%",
                        display:"flex",
                        justifyContent:"space-between",
                        padding:"10px"
                    }}>
                        <Text as="span" fontWeight='bold' variant="bodyMd">Width</Text>
                        <Text as="span" variant="bodyMd" fontWeight='bold'>Height</Text>
                        <Text as="span" variant="bodyMd" fontWeight='bold'>Price</Text>
                    </div>
                </Listbox.Option>
                    {
                        list.length > 0 && <>
                        {
                            list.map((el,ind) => <Listbox.Option key={"price-" + ind} value={"price-" + ind} >
                                <div style={{
                                    width:"100%",
                                    display:"flex",
                                    justifyContent:"space-between",
                                    padding:"10px"
                                }}>
                                    <Text as="span" variant="bodyMd">{el.width}</Text>
                                    <Text as="span" variant="bodyMd">{el.height}</Text>
                                    <Text as="span" variant="bodyMd">{el.price}</Text>
                                </div>
                            </Listbox.Option>)
                        }
                        <div style={{height:"8px",width:"100%"}}></div>
                        <Divider/>
                        <div style={{height:"8px",width:"100%"}}></div></>
                    }
                    
                    <LegacyStack horizontal wrap={false} distribution='fillEvenly'>
                        <LegacyStack.Item>
                            <div style={{maxWidth:'150px'}}>
                                <TextField placeholder="Width" value={width} min={0} onChange={(newValue)=>setWidth(newValue)} type="number"/>
                            </div>
                        </LegacyStack.Item>
                        <LegacyStack.Item>
                            <div style={{maxWidth:'150px'}}>
                              <TextField placeholder="Height" value={height}  min={0} onChange={(newValue)=>setHeight(newValue)}  type="number"/>
                            </div>
                        </LegacyStack.Item>
                        <LegacyStack.Item>
                            <div style={{maxWidth:'150px'}}>
                                <TextField placeholder="Price" value={price} min={0} onChange={(newValue)=>setPrice(newValue)} type="number"/>
                            </div>
                        </LegacyStack.Item>
                    </LegacyStack>
                    <LegacyStack spacing="tight">
                        <div style={{marginTop:"10px"}}>
                            <Button icon={CirclePlusMinor} onClick={addPrice}>
                                Add
                            </Button>
                        </div>
                    </LegacyStack>
                </Listbox>
            </Modal.Section>

        </Modal>
        <LegacyCard>
            <EmptyState
                heading="Create Pricing Option For Calculator"
                action={{
                    content:"Add Pricing",
                    icon:CashDollarMajor,
                    onAction:()=>{setOpen(true)}
                }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            ></EmptyState>
        </LegacyCard>
    </Page>
  )
}

export default CreatePrice