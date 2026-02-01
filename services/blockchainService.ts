
export interface TxVerificationResult {
  success: boolean;
  status: 'SUCCESS' | 'FAILED' | 'NOT_FOUND' | 'ERROR' | 'PENDING';
  blockNumber?: number;
  timestamp?: number;
}

export const blockchainService = {
  /**
   * TRC20 (Tron USDT) Transaction Verification
   * Uses TronGrid API
   */
  checkTronTx: async (txHash: string): Promise<TxVerificationResult> => {
    try {
      const res = await fetch(`https://api.trongrid.io/v1/transactions/${txHash}`);
      const data = await res.json();

      if (!data.data || data.data.length === 0) {
        return { success: false, status: 'NOT_FOUND' };
      }

      const tx = data.data[0];
      const isSuccess = tx.ret[0].contractRet === "SUCCESS";

      return {
        success: isSuccess,
        status: isSuccess ? 'SUCCESS' : 'FAILED',
        blockNumber: tx.blockNumber,
        timestamp: tx.block_timestamp
      };
    } catch (err) {
      console.error("Tron verification error:", err);
      return { success: false, status: 'ERROR' };
    }
  },

  /**
   * ERC20 (Ethereum USDT) Transaction Verification
   * Uses Etherscan API (Requires API Key in production)
   */
  checkEthTx: async (txHash: string): Promise<TxVerificationResult> => {
    try {
      // In production, use process.env.ETHERSCAN_API_KEY
      const apiKey = "FREE_KEY"; 
      const res = await fetch(
        `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${apiKey}`
      );
      const data = await res.json();

      if (data.status === "0" && data.message === "NOTOK") {
        return { success: false, status: 'ERROR' };
      }

      if (data.result && data.result.status) {
        const isSuccess = data.result.status === "1";
        return {
          success: isSuccess,
          status: isSuccess ? 'SUCCESS' : 'FAILED'
        };
      }

      return { success: false, status: 'NOT_FOUND' };
    } catch (err) {
      console.error("Ethereum verification error:", err);
      return { success: false, status: 'ERROR' };
    }
  }
};
