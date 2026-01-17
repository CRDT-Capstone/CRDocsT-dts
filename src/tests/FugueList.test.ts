import { FugueList } from "../Fugue/FugueList";
import { emptyFugueList } from "./mocks";

describe("Fugue List Tests", ()=>{

    describe("Given a Fugue list ", ()=>{
        test("Empty Fugue List has an empty string", ()=>{
            expect(emptyFugueList.observe()).toBe('');
        })
    })

});