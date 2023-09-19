import { exec } from 'child_process';

function runDev() {
  const npmCommand = 'npm run dev';
  
  exec(npmCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.log(stdout);
    }
  });
}

runDev();
