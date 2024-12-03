import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

interface CaptchaSolution {
  direction: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private direction: string[] = ['JvSmvddMoxiHZKPSWJwgRoxgeUDuNCVi', 'EBXVFgnBkYhlIlxDxlhQnCAizYTciYne', 'kJBTmLmsREVOhhSOBzVFsDSULflYKGCI', 'LQIsTfVunAwnqkbfGnbFQTdNCKWCrfbR', 'pQAhNKvUMgHDPlkaFUdPKUPFtSXeJgtI', 'bDVdYuvJKslgbgLtvSgWBRZXRjJfAwUn', 'pMmQwAfXJabISseEJtzPWEmzTKNGIZaT', 'bFXSKgmjMIzSPVjuRnnzVLXaAqbcDhwA'];
  private targets: string[][] = 
  [
    ['RNCiXlhwZlWTiGwjygYNoavUIPfsjfDT', 'KJKGeBVSIlkmrNdIrrZFmDnicIOvFPYw', 'hEMmKVvwBAwKMmjQfTvUFoHMGcUkMCqG', 'JZksUeZyEFiunfQTvOPDPJeSpgXGsLRu', 'dMAAxJcnRjJLXVWJwEMcRdFYzQLTYyyo', 'NmOzYaCElwpyGTMiigFoGRtnXHnOdeCd', 'IcLlbVcKeIoOJFgzVxCeEQqAuefVUnTi', 'SRXMTopFGtKyJaCRVNyusIVhKfJCWRQS'],
    ['unpzQjQHEMWPTRKfpbQLwbIjMjNxtfVw', 'DmBnBbaVeCxEeknlJVWqAsRrBQOZQomQ', 'yVulvYVEhRjZzyYVjsuidacGmkhrwXHD', 'OZtSnHFYyxwSQUQPSsZTCEkuIwMITFCB', 'eBAqqnZyiimvrsVwSlfkSJaYDALFrqhP', 'ehSXXBwiCpLvcDStbtNjxRvTsLiQLUbx', 'QWgtxFDYKuBehKsyDtaYJlPNsRbjmaoY', 'jAzLlYTentLPBYMSObcGGsqOEyNynkRo'],
    ['BQzaKtdXOhZENwPiRdbjOGCevjIMatpZ', 'cBxAaMNxmeESPKStjadMTOVDCyxfvSij', 'KLMCIGVjyFsSoCXopYYpCCPNqGgIkLCN', 'NSMqZEBBWLHGTgUsHmtPwgPaScisxZfN', 'jXffEWXyNOoaOPkzyBVSkGbHiNdpqvtS', 'kQeaigwybIGeGqpOnIWpkAsLCBHnXcgE', 'lDUxUkZjvhnCdvWTkgyZANgpDlAAVlfQ', 'NvnNRSvKLkLcFbZoLMkLCDooYvWeqsmO'],
    ['COiSkOFvbuaVvziQUCstLjfZEHuVSyZX', 'YNnfPyqWGnauQvsosVvJLxeeJInalPtR', 'fhicsefFMOCxPdhEyVqInzOmeXstHkpL', 'XWiegAtFJHtFnrUNveRYAWELmhuDEEZt', 'qFoDEPxoMHsgbWLDJmRSwyUUcnTLUgvH', 'dibniEAoRnyMnGQZMpnCSKnWpXcOsBeO', 'bFsVwvzaDxVXWzbggqrhOHbsYeLMQEmM', 'QItIoWpUGWmXqxRnUnaPYbtNOyFxrBNl'],
    ['SOaOGPeoqhkKqUHdcDLFMStSjHAuXLlC', 'iWkvJckTThzPNGYUcLGtNYeFJeuDdHbK', 'LkPLZAhCFJoAUkcFQQmXQaLVzngXEUOi', 'bnKWCYIvFnoTSmyWfytChwZmhEcFitbH', 'TIvfpEUhcPQKOvSRzjLRbRsnwZYPjlCQ', 'sjqDEjdFLpDscVXqNPcuIbmGlXwxzMzw', 'IWYcmqzmDCBvsjchKenvOjnDNGwLgyrh', 'VBktQKtuPlsOhOnEdgoOLTbSeLMdlNhY'],
    ['qceeMyXBtYGNSCsrgVfonwYeCqcfjDDU', 'UsykxNuJvQDHbHtpSGQRcTYABMwRzbMA', 'yWjqTDIJxCpYQVBpDJKBROHXomezHAPJ', 'XSqWtGzcrNDxHPHcWoHDSJezNHpAuiCv', 'nduHNSGZmNhmKLPlOmTFIiqAtMzqKIqm', 'bYoKwXlfmkREPHMJWwBkSsUYVsRAQrXI', 'jFzvVPRZroxdYGmJJvEkwfLLbPxRvgKO', 'zqnqRdZpKeJRaeEVhRrwCIbUhmLWoErz'],
  ];
  directionIndex: number = 0;
  currentTarget: string[] = [];
  currentIndex: number = 0;

  constructor(
    private firestore: Firestore,
  ) { }

  public async resolveCaptcha(): Promise<boolean> {
    let col = collection(this.firestore, "captcha-solutions");
    const fetchQuery = query(
      col, 
      where("direction", "==", this.direction[this.directionIndex]),
      where("value", "==", this.currentTarget[this.currentIndex]),
    );

    const querySnapshot = await getDocs(fetchQuery);
    return querySnapshot.docs.length > 0;
  }

  public getNewDirection(): string {
    this.directionIndex = this.getRandomInt(this.direction.length);
    return `../../../assets/captcha/direction/${this.direction[this.directionIndex]}.png`;
  }

  public getTargetSize(): number {
    return this.currentTarget.length;
  }

  public isCurrentIndex(i: number): boolean {
    return i == this.currentIndex;
  }

  public getNewTarget(): string {
    this.currentTarget = this.targets[this.getRandomInt(this.targets.length)];
    this.currentIndex = this.getRandomInt(this.currentTarget.length);
    return this.getTargetUrl();
  }

  public getPreviousTarget(): string {
    if (this.currentIndex == 0) {
      this.currentIndex = this.currentTarget.length - 1;
    } else {
      this.currentIndex -= 1;
    }
    return this.getTargetUrl();
  }

  public getNextTarget(): string {
    if (this.currentIndex == this.currentTarget.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex += 1;
    }
    return this.getTargetUrl();
  }

  private getTargetUrl(): string {
    return `../../../assets/captcha/target/${this.currentTarget[this.currentIndex]}.png`;
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }


//CARGA EN BD DE IMÁGENES
  // private uploadSolutions() {
  //   this.solutions.forEach(async (s) => {
  //     await this.crearRegistro(s);
  //   });
  // }

  // private async crearRegistro(solution: CaptchaSolution) {
  //   let dataCollection = collection(this.firestore, "captcha-solutions");
  //   await addDoc(dataCollection, solution);
  // }

  // readonly solutions: CaptchaSolution[] = [
  //   {direction: 'JvSmvddMoxiHZKPSWJwgRoxgeUDuNCVi', value: 'unpzQjQHEMWPTRKfpbQLwbIjMjNxtfVw'},
  //   {direction: 'bFXSKgmjMIzSPVjuRnnzVLXaAqbcDhwA', value: 'DmBnBbaVeCxEeknlJVWqAsRrBQOZQomQ'},
  //   {direction: 'pMmQwAfXJabISseEJtzPWEmzTKNGIZaT', value: 'yVulvYVEhRjZzyYVjsuidacGmkhrwXHD'},
  //   {direction: 'bDVdYuvJKslgbgLtvSgWBRZXRjJfAwUn', value: 'OZtSnHFYyxwSQUQPSsZTCEkuIwMITFCB'},
  //   {direction: 'pQAhNKvUMgHDPlkaFUdPKUPFtSXeJgtI', value: 'eBAqqnZyiimvrsVwSlfkSJaYDALFrqhP'},
  //   {direction: 'LQIsTfVunAwnqkbfGnbFQTdNCKWCrfbR', value: 'ehSXXBwiCpLvcDStbtNjxRvTsLiQLUbx'},
  //   {direction: 'kJBTmLmsREVOhhSOBzVFsDSULflYKGCI', value: 'QWgtxFDYKuBehKsyDtaYJlPNsRbjmaoY'},
  //   {direction: 'EBXVFgnBkYhlIlxDxlhQnCAizYTciYne', value: 'jAzLlYTentLPBYMSObcGGsqOEyNynkRo'},
  //   {direction: 'JvSmvddMoxiHZKPSWJwgRoxgeUDuNCVi', value: 'RNCiXlhwZlWTiGwjygYNoavUIPfsjfDT'},
  //   {direction: 'bFXSKgmjMIzSPVjuRnnzVLXaAqbcDhwA', value: 'KJKGeBVSIlkmrNdIrrZFmDnicIOvFPYw'},
  //   {direction: 'pMmQwAfXJabISseEJtzPWEmzTKNGIZaT', value: 'hEMmKVvwBAwKMmjQfTvUFoHMGcUkMCqG'},
  //   {direction: 'bDVdYuvJKslgbgLtvSgWBRZXRjJfAwUn', value: 'JZksUeZyEFiunfQTvOPDPJeSpgXGsLRu'},
  //   {direction: 'pQAhNKvUMgHDPlkaFUdPKUPFtSXeJgtI', value: 'dMAAxJcnRjJLXVWJwEMcRdFYzQLTYyyo'},
  //   {direction: 'LQIsTfVunAwnqkbfGnbFQTdNCKWCrfbR', value: 'NmOzYaCElwpyGTMiigFoGRtnXHnOdeCd'},
  //   {direction: 'kJBTmLmsREVOhhSOBzVFsDSULflYKGCI', value: 'IcLlbVcKeIoOJFgzVxCeEQqAuefVUnTi'},
  //   {direction: 'EBXVFgnBkYhlIlxDxlhQnCAizYTciYne', value: 'SRXMTopFGtKyJaCRVNyusIVhKfJCWRQS'},
  //   {direction: 'JvSmvddMoxiHZKPSWJwgRoxgeUDuNCVi', value: 'BQzaKtdXOhZENwPiRdbjOGCevjIMatpZ'},
  //   {direction: 'bFXSKgmjMIzSPVjuRnnzVLXaAqbcDhwA', value: 'cBxAaMNxmeESPKStjadMTOVDCyxfvSij'},
  //   {direction: 'pMmQwAfXJabISseEJtzPWEmzTKNGIZaT', value: 'KLMCIGVjyFsSoCXopYYpCCPNqGgIkLCN'},
  //   {direction: 'bDVdYuvJKslgbgLtvSgWBRZXRjJfAwUn', value: 'NSMqZEBBWLHGTgUsHmtPwgPaScisxZfN'},
  //   {direction: 'pQAhNKvUMgHDPlkaFUdPKUPFtSXeJgtI', value: 'jXffEWXyNOoaOPkzyBVSkGbHiNdpqvtS'},
  //   {direction: 'LQIsTfVunAwnqkbfGnbFQTdNCKWCrfbR', value: 'kQeaigwybIGeGqpOnIWpkAsLCBHnXcgE'},
  //   {direction: 'kJBTmLmsREVOhhSOBzVFsDSULflYKGCI', value: 'lDUxUkZjvhnCdvWTkgyZANgpDlAAVlfQ'},
  //   {direction: 'EBXVFgnBkYhlIlxDxlhQnCAizYTciYne', value: 'NvnNRSvKLkLcFbZoLMkLCDooYvWeqsmO'},
  //   {direction: 'JvSmvddMoxiHZKPSWJwgRoxgeUDuNCVi', value: 'COiSkOFvbuaVvziQUCstLjfZEHuVSyZX'},
  //   {direction: 'bFXSKgmjMIzSPVjuRnnzVLXaAqbcDhwA', value: 'YNnfPyqWGnauQvsosVvJLxeeJInalPtR'},
  //   {direction: 'pMmQwAfXJabISseEJtzPWEmzTKNGIZaT', value: 'fhicsefFMOCxPdhEyVqInzOmeXstHkpL'},
  //   {direction: 'bDVdYuvJKslgbgLtvSgWBRZXRjJfAwUn', value: 'XWiegAtFJHtFnrUNveRYAWELmhuDEEZt'},
  //   {direction: 'pQAhNKvUMgHDPlkaFUdPKUPFtSXeJgtI', value: 'qFoDEPxoMHsgbWLDJmRSwyUUcnTLUgvH'},
  //   {direction: 'LQIsTfVunAwnqkbfGnbFQTdNCKWCrfbR', value: 'dibniEAoRnyMnGQZMpnCSKnWpXcOsBeO'},
  //   {direction: 'kJBTmLmsREVOhhSOBzVFsDSULflYKGCI', value: 'bFsVwvzaDxVXWzbggqrhOHbsYeLMQEmM'},
  //   {direction: 'EBXVFgnBkYhlIlxDxlhQnCAizYTciYne', value: 'QItIoWpUGWmXqxRnUnaPYbtNOyFxrBNl'},
  //   {direction: 'JvSmvddMoxiHZKPSWJwgRoxgeUDuNCVi', value: 'SOaOGPeoqhkKqUHdcDLFMStSjHAuXLlC'},
  //   {direction: 'bFXSKgmjMIzSPVjuRnnzVLXaAqbcDhwA', value: 'iWkvJckTThzPNGYUcLGtNYeFJeuDdHbK'},
  //   {direction: 'pMmQwAfXJabISseEJtzPWEmzTKNGIZaT', value: 'LkPLZAhCFJoAUkcFQQmXQaLVzngXEUOi'},
  //   {direction: 'bDVdYuvJKslgbgLtvSgWBRZXRjJfAwUn', value: 'bnKWCYIvFnoTSmyWfytChwZmhEcFitbH'},
  //   {direction: 'pQAhNKvUMgHDPlkaFUdPKUPFtSXeJgtI', value: 'TIvfpEUhcPQKOvSRzjLRbRsnwZYPjlCQ'},
  //   {direction: 'LQIsTfVunAwnqkbfGnbFQTdNCKWCrfbR', value: 'sjqDEjdFLpDscVXqNPcuIbmGlXwxzMzw'},
  //   {direction: 'kJBTmLmsREVOhhSOBzVFsDSULflYKGCI', value: 'IWYcmqzmDCBvsjchKenvOjnDNGwLgyrh'},
  //   {direction: 'EBXVFgnBkYhlIlxDxlhQnCAizYTciYne', value: 'VBktQKtuPlsOhOnEdgoOLTbSeLMdlNhY'},
  //   {direction: 'JvSmvddMoxiHZKPSWJwgRoxgeUDuNCVi', value: 'qceeMyXBtYGNSCsrgVfonwYeCqcfjDDU'},
  //   {direction: 'bFXSKgmjMIzSPVjuRnnzVLXaAqbcDhwA', value: 'UsykxNuJvQDHbHtpSGQRcTYABMwRzbMA'},
  //   {direction: 'pMmQwAfXJabISseEJtzPWEmzTKNGIZaT', value: 'yWjqTDIJxCpYQVBpDJKBROHXomezHAPJ'},
  //   {direction: 'bDVdYuvJKslgbgLtvSgWBRZXRjJfAwUn', value: 'XSqWtGzcrNDxHPHcWoHDSJezNHpAuiCv'},
  //   {direction: 'pQAhNKvUMgHDPlkaFUdPKUPFtSXeJgtI', value: 'nduHNSGZmNhmKLPlOmTFIiqAtMzqKIqm'},
  //   {direction: 'LQIsTfVunAwnqkbfGnbFQTdNCKWCrfbR', value: 'bYoKwXlfmkREPHMJWwBkSsUYVsRAQrXI'},
  //   {direction: 'kJBTmLmsREVOhhSOBzVFsDSULflYKGCI', value: 'jFzvVPRZroxdYGmJJvEkwfLLbPxRvgKO'},
  //   {direction: 'EBXVFgnBkYhlIlxDxlhQnCAizYTciYne', value: 'zqnqRdZpKeJRaeEVhRrwCIbUhmLWoErz'},
  // ]
}
