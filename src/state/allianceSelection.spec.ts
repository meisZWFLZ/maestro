import { Test, TestingModule } from '@nestjs/testing'
import { AllianceSelection, TeamId } from './allianceSelection';


describe('Alliance selection logic', () => {
    let allianceSel: AllianceSelection;
    const teams: Array<TeamId> = [
        '1',    '2',    '3',    '4',
        '5',    '6',    '7',    '8',
        '9',    '10',   '11',   '12',
        '13',   '14',   '15',   '16',
    ];

    beforeEach(() => {
        allianceSel = new AllianceSelection(teams);
    });

    /**
     * Alliance selection initialization tests
     */
    describe('Alliance selection initialization', () => {
        it('The top ranked team shall be picking.', () => {
            expect(allianceSel.state.picking).toBe('1');
        });

        it('The currently selected team shall be null.', () => {
            expect(allianceSel.state.selected).toBe(null);
        });

        it('The top ranked team shall not be in the eligible list.', () => {
            let found: boolean = false;
            for(let i = 0; i < allianceSel.state.eligible.length; i++) {
                if(allianceSel.state.eligible[i] === '1' as TeamId) {
                    found = true;
                    break;
                }
            }
            expect(found).toBe(false);
        });

        it('The top ranked team shall not be in the remaining list.', () => {
            let found: boolean = false;
            for(let i = 0; i < allianceSel.state.remaining.length; i++) {
                if(allianceSel.state.remaining[i] === '1' as TeamId) {
                    found = true;
                    break;
                }
            }
            expect(found).toBe(false);
        });
    });

    /**
     * Alliance selection pick tests
     */
});