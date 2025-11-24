import React from "react";
import { Button,Font,Head,Heading,Html,Link,Preview,Row, Section,Text } from "@react-email/components";


interface verificationEmailProps{
  username:string;
  resetLink:string;
}


export function ForgotPasswordTemplate({username,resetLink}:verificationEmailProps){
    return (
        <Html lang="en">
            <Head>
                <title>Forgot Password</title>
                <Font 
                fontFamily="Roboto"
                fallbackFontFamily="Verdana"
                webFont={{
                    url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                    format: "woff2"
                }}
                fontWeight={400}
                fontStyle="normal"
                />
            </Head>

            <Preview>Resetyour Password using the Link below</Preview>
            <Section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            You recently requested to reset your password. Click the button below to set a new password.
          </Text>
        </Row>
        <Row style={{ margin: '20px 0' }}>
          <Button
            href={resetLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#ff0000',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              display: 'inline-block',
              padding: '10px 20px',
            }}
          >
            Reset Password
          </Button>
        </Row>
        <Row>
          <Text>
            If you did not request a password reset, please ignore this email. This link will expire in 10 minutes.
          </Text>
        </Row>
        <Row>
          <Text>Thanks, <br /> Your Company Team</Text>
        </Row>
      </Section>
        </Html>
    )
}

export default ForgotPasswordTemplate;