import React from 'react';
import CurrentPostMeta from './meta';
import { PostImage, CodeSnippet } from '@components/client';
import { CodeBlock } from '@components/server';
import defaultDisplayJPEG from '@assets/qmk-customize-oled/default-display.jpeg';
import pressedKeyJPEG from '@assets/qmk-customize-oled/pressed.jpeg';
import releasedKeyJPEG from '@assets/qmk-customize-oled/released.jpeg';

const pseudoCodeC = 'assets/qmk-customize-oled/pseudocodes.c';

export default function Post() {
  return (
    <div className="mx-auto px-12 gap-10 place-content-center max-w-5xl">
      <div className="mt-6 xs:text-xl text-md leading-10">
        <h1 className="mb-1">{CurrentPostMeta.title}</h1>
        <h3 className="text-gray-400 mb-4">
          {(new Date(CurrentPostMeta.date)).toLocaleDateString('en-us', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
        </h3>
        <article>
          <section>
            <p>
              If you want to skip the yapping and just want to see the final product, click <a href="#how-it-looks" className="underline">here!</a>
            </p>
          </section>
          <br />
          <section>
            <p>Back then, I did not know that the OLED display of Odin75 is programmable. I recently learned about the existence of QMK firmware and was happy that my keyboard uses that firmware. You can check the Github repository of QMK <a href="https://github.com/qmk/qmk_firmware" className="underline">here</a>. Basically, I can customize my keyboard firmware, including what is shown on the OLED display.</p>
            <PostImage src={defaultDisplayJPEG.src} alt="Default display of Odin75 (not mine, found on reddit)" figureNo={1} />
            <p>Above, that is the default display of Odin75. Bongo Cat animation with Words Per Minute (WPM) and Caps Lock status. I wanted to change it to something more personal. These are the things that I wanted to show on the OLED display:
            </p>
            <div className="flex justify-center">
              <ol className="list-decimal ml-6">
                <li>Instead of Bongo Cat, I want to see an animation if I pressed a key.</li>
                <li>Show the last key pressed.</li>
                <li>Show the total number of keys pressed since the last reset.</li>
                <li>Show session time.</li>
                <li>A way to reset the data above, like starting a new session.</li>
              </ol>
            </div>
          </section>
          <section>
            <h2>Change the Bongo Cat!</h2>
            <p>As much as everyone love cats, I am getting tired of seeing the same animation, a change would be nice. After grueling hours of creating the perfect frames, below is what I manage to create:
            </p>
            <div>
              <PostImage src={pressedKeyJPEG.src} alt="Frame of pressing a key" figureNo={2} />
              <PostImage src={releasedKeyJPEG.src} alt="Frame of releasing a key" figureNo={3} />
            </div>
            <p>These images are only 128x32, OLED display has 128x64. The other remaining pixels can be used for texts (which will come later this post).</p>
            <p>Now that we have the images, it is time to build the code. Upon checking the Github repository of QMK, under the Odin75 directory, I found a file named <a href="https://github.com/qmk/qmk_firmware/blob/master/keyboards/kbdfans/odin75/lib/bongocat.c" className="underline">bongocat.c</a>. Obviously, this is the file responsible in displaying the Bongo Cat animation. The gist of the <CodeSnippet>render_bongocat</CodeSnippet> is it renders the appropriate frame depending on the WPM (provided by a QMK function <CodeSnippet>get_current_wpm()</CodeSnippet>).</p>
            <p>As for me, I don't need the <CodeSnippet>get_current_wpm()</CodeSnippet>. I need a function that executes when a key is pressed. While searching the QMK codebase, I found <CodeSnippet>process_record_user()</CodeSnippet>. Click <a href="https://github.com/qmk/qmk_firmware/blob/master/docs/custom_quantum_functions.md" className="underline">here</a> to know more about the function. Below is a not-so-complete code of displaying our custom animation based on key press state.</p>
            <CodeBlock codePath={pseudoCodeC} language="c" lineFrom={2} lineTo={12} caption="Listing 1. Pseudocode for displaying our new images" />
            <p>
              As of writing, the guide to convert an image to OLED display in bongocat.c seems to be broken. A quick google search led me to <a href="https://javl.github.io/image2cpp/" className="underline">javl.github.io/image2cpp</a>. The website converts an image to a C array that can be used in QMK. As soon as I got the array, I just plugged that to Listing 1 line 1. You can add Listing 1 to <a href="https://github.com/qmk/qmk_firmware/blob/master/keyboards/kbdfans/odin75/odin75.c" className="underline">odin75.c</a> and it should work!
            </p>
          </section>
          <section>
            <h2>Show the last key pressed and total number of keys pressed</h2>
            <p>We can use the argument <CodeSnippet>keycode</CodeSnippet> in <CodeSnippet>process_record_user()</CodeSnippet>. It is equal to the key being pressed or released.</p>
            <CodeBlock codePath={pseudoCodeC} language="c" lineFrom={26} lineTo={42} caption="Listing 2. Code for showing the last key pressed and total number of keys pressed" />
            <p>
              Listing 2 is just added to the if-statement in Listing 1. On line 2, <CodeSnippet>key_pressed</CodeSnippet> is a global variable that I initialized somewhere in the code. This is my counter for the total number of keys pressed. Line 4 and 8 tells the firmware on what part of the display to write the text. <CodeSnippet>oled_write()</CodeSnippet> is a QMK function that writes text to the OLED display. When using <CodeSnippet>oled_write()</CodeSnippet>, you can fit 21 characters per line. The text that I will display has a total of 5 characters. Line 6 is for clearing the previous displayed text (5 empty spaces). Line 9 is for displaying the actual last key pressed. Line 7 and 8 is my magic for displaying the 5 characters in the most right part of the container (Kinda like <CodeSnippet>text-align: right;</CodeSnippet> in CSS). Line 12 to 16 is the code for displaying the total number of <span className="font-bold">THOCKS</span> or key pressed.
            </p>
          </section>
          <section>
            <h2>Show session time</h2>
            <p>To show the session time, I implemented the code inside <CodeSnippet>oled_task_kb()</CodeSnippet> function. Based from the code inside of that function, I believe this is called in an infinite loop somewhere. Since we want to show the updated session time all the time, I believe this is the best place to put it. Below is the code that I added.</p>
            <CodeBlock codePath={pseudoCodeC} language="c" lineFrom={45} lineTo={83} caption="Listing 3. Code for showing the session time" />
            <p>Regarding how we display the text, it is the same logic. Line 30 to Line 36 is to display the session time on the right most part of the OLED.</p>
          </section>
          <section>
            <h2>Reset the data</h2>
            <p>
              Since we are dealing with user input, then we need to modify <CodeSnippet>process_record_user</CodeSnippet> again. I configured that if I press the <span className="text-italic">KC_PAUSE + r</span> key codes. Below is the code that I added to reset the session time and total number of keys.
            </p>
            <CodeBlock codePath={pseudoCodeC} language="c" lineFrom={85} lineTo={113} caption="Listing 4. Modified process_record_user(). To reset session time and total number of keys pressed" />
          </section>
          <section id="how-it-looks">
            <h2>How it looks!</h2>
            <div className="flex justify-center">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/wjtArgqex0o?si=BParvsc4_0xM9azb" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
            <p>
              Kinda slick if you ask me. I was thinking to add some notification feature but that would be too much, maybe in the future. If you want to see the full code, you can check my QMK fork <a href="https://github.com/macofiloteo/qmk_firmware/tree/master/keyboards/kbdfans/odin75" className="underline">here!</a>
            </p>
          </section>
        </article>
      </div>
    </div >
  );
}
