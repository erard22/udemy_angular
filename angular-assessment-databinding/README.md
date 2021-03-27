#Bind it!
1. Create three new components: GameControl, Odd and Even
1. The GameControl Component should have buttons to start and stop the game
1. When starting the game, an event (holding a incrementing number) should get emitted each second (ref = setInterval())
1. The event should be listenable from outside the component
1. When stopping the game, no more events should get emitted (clearInterval(ref))
1. A new Odd component should get created for every odd number emitted, the same should happen for the Even Component (on even numbers)
1. Simply output Odd - NUMBER or Even - NUMBER in the two components
1. Style the element (e.g. paragraph) holding your output text differently in both components
