/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
   

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

            try{

            var getRecord = scriptContext.newRecord;

            var getRecordId = getRecord.id;


            if (_logValidation(getRecordId))
            {
            let loadSalesOrder = record.load({

                type: 'salesorder',
                id: getRecordId,

            });


            let getItemCount = loadSalesOrder.getLineCount({
                sublistId : 'item'
            });

            var digitalArr = [];

            for( let i = 0; i < getItemCount; i++){


                let getItemId = loadSalesOrder.getSublistValue({

                    sublistId: 'item',
                    fieldId: 'item',
                    line: i
                });


                let lookupOnItemRec = search.lookupFields({
                    type: search.Type.ITEM,
                    id: getItemId,
                    columns: ['custitem41']
                });

                
                let digitalValue = lookupOnItemRec.custitem41;

                digitalArr.push(digitalValue);
            
            }


         let checkTrue = allAreTrue(digitalArr);

            if(checkTrue){

                loadSalesOrder.setValue({
                    fieldId: 'custbody_all_digital_items',
                    value: true
                });
            }
            else{

                loadSalesOrder.setValue({
                    fieldId: 'custbody_all_digital_items',
                    value: false
                });
            }

            function allAreTrue(arr) {

                return arr.every((element) => element === true);

            }

            loadSalesOrder.save();

        }
    }
    catch(e){
        log.debug('error in afterSubmit', e.toString());
    }
    }

        function _logValidation(value) {
            if (
              value != null &&
              value != "" &&
              value != "null" &&
              value != undefined &&
              value != "undefined" &&
              value != "@NONE@" &&
              value != "NaN"
            ) {
              return true;
            } else {
              return false;
            }
          }


        return {afterSubmit}

    });
