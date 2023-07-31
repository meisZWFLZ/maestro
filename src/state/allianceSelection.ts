import { Team } from "@18x18az/rosetta";


let MAX_NUM_ALLIANCES = 16;

export type TeamId = string;

interface Alliance {
    team1: TeamId
    team2?: TeamId
}

interface AllianceSelectionStatus {
    picking: TeamId | null
    selected: TeamId | null
    eligible: Array<TeamId>
    remaining: Array<TeamId>
    alliances: Array<Alliance>
}

export class AllianceSelection {

    // current state
    state: AllianceSelectionStatus = {
        eligible: [],
        remaining: [],
        alliances: [],
        picking: null,
        selected: null
    };

    // TODO: track changes/history

    /*
    precondition for constructor:
    - teams must already be sorted, from first seed -> lowest seed
    */
    constructor(teams: Array<TeamId>) {

        // copy teams into eligible and remaining
        this.state.eligible = [...teams];
        this.state.remaining = [...teams];
        this.state.selected = null;
        this.getNextPicker();
        this.onUpdate();
    }

    pick(team: TeamId) {
        if(!this.state.eligible.includes(team)) {
            return;
        }

        this.state.selected = team;
    } // end pick()

    cancel() {
        if(this.state.selected) {
            this.state.selected = null;
        }
    } // end cancel()

    accept() {
        if(!this.state.selected) {
            return;
        }

        let found: boolean = false;
        for(let i = 0; i < this.state.eligible.length; i++) {
            if(this.state.selected == this.state.eligible[i]) {
                this.state.eligible.splice(i, 1);
                found = true;
                break;
            }
        }

        if(!found) {
            return;
        }

        found = false;
        for(let i = 0; i < this.state.remaining.length; i++) {
            if(this.state.selected == this.state.remaining[i]) {
                this.state.remaining.splice(i, 1);
                found = true;
                break;
            }
        }

        if(!found) {
            return;
        }

        let alliance: Alliance = {
            team1: this.state.picking as TeamId,
            team2: this.state.selected as TeamId
        };
        this.state.alliances.push(alliance);


        this.state.selected = null;

        if(this.state.alliances.length == MAX_NUM_ALLIANCES || this.state.remaining.length == 0 || this.state.eligible.length < 2) {
            this.selectionComplete();
            return;
        }

        this.getNextPicker();
    } // end accept()

    decline() {
        if(!this.state.selected) {
            return;
        }

        let found: boolean = false;
        for(let i = 0; i < this.state.eligible.length; i++) {
            if(this.state.selected == this.state.eligible[i]) {
                this.state.eligible.splice(i, 1);
                found = true;
                break;
            }
        }

        if(!found) {
            return;
        }

        this.state.selected = null;

        if(this.state.eligible.length == 0){
            this.selectionComplete();
        }
    } // end decline()

    /**
     * Promote the next eligible team to be team captain.
     */
    getNextPicker() {
        this.state.picking = this.state.remaining.shift() as TeamId;

        for(let i = 0; i < this.state.eligible.length; i++) {
            if(this.state.picking == this.state.eligible[i]) {
                this.state.eligible.splice(i, 1);
                break;
            }
        }
    } // end getNextPicker()

    undo() {
    } // end undo()

    noShow() {
        this.getNextPicker();

        if(this.state.eligible.length == 0) {
            this.selectionComplete();
        }
    } // end noShow()

    selectionComplete() {
    } // end selectionComplete()

    onUpdate() {
    } // end onUpdate()

}